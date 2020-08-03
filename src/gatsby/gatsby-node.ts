import { paramCase } from 'change-case';
import {
  CreatePagesArgs,
  GatsbyNode,
  NodeInput,
  SourceNodesArgs,
} from 'gatsby';
import { resolve } from 'path';

import { AREA_TYPES, CORONAVIRUS_DATA_FIELDS } from '../constants';
import { CreateLocationPagesQuery } from '../types/generated/gatsby-graphql';
import { getCoronavirusData } from '../sources/coronavirus';
import { getLocations } from '../sources/locations';
import { getPopulations } from '../sources/populations';
import { tryCacheWithFallback } from '../utils/cache';
import { prepareHistoryData } from '../utils/history';
import { rankLocations } from '../utils/location';
import { preparePopulationData } from '../utils/population';
import { prepareSummaryData } from '../utils/summary';

export const createPages: GatsbyNode['createPages'] = async ({
  actions,
  graphql,
}: CreatePagesArgs): Promise<void> => {
  const { createPage } = actions;

  // Load all locations
  const { data } = await graphql<CreateLocationPagesQuery>(
    `
      query CreateLocationPages {
        allLocation {
          edges {
            node {
              id
              slug
            }
          }
        }
      }
    `
  );

  // Create page for each location
  data?.allLocation?.edges?.forEach(({ node }) => {
    createPage({
      path: node.slug as string,
      component: resolve('./src/templates/location.tsx'),
      context: node,
    });
  });
};

export const sourceNodes: GatsbyNode['sourceNodes'] = async ({
  actions,
  cache,
  createContentDigest,
  createNodeId,
  reporter,
}: SourceNodesArgs): Promise<void> => {
  const { createNode } = actions;

  // Load all data from cache or APIs
  const locations = await tryCacheWithFallback(
    [cache, 'locations', reporter],
    getLocations,
    [AREA_TYPES]
  );
  const populations = await tryCacheWithFallback(
    [cache, 'populations', reporter],
    getPopulations
  );
  const coronavirusData = await tryCacheWithFallback(
    [cache, 'coronavirusData', reporter],
    async (areaTypes: string[], dataFields: string[]) => {
      const groupedData = await Promise.all(
        areaTypes.map(async (areaType) =>
          getCoronavirusData(areaType, dataFields)
        )
      );
      return groupedData.flat();
    },
    [AREA_TYPES, CORONAVIRUS_DATA_FIELDS]
  );

  // Convert API response arrays into objects
  const populationData = preparePopulationData(populations);
  const historyData = prepareHistoryData(coronavirusData);
  const summaryData = prepareSummaryData(historyData);

  locations
    .sort(rankLocations(summaryData, populationData))
    .forEach(
      (
        [areaCode, areaName, areaType]: [string, string, string],
        index: number
      ) => {
        // Combine calculated data
        const location = {
          areaCode,
          areaName,
          areaType,
          slug: `${areaType}/${String(paramCase(areaName))}`,
          population: populationData[areaCode],
          rank: index + 1,
          history: historyData[areaCode],
          summary: summaryData[areaCode],
        };

        // Add to Gatsby nodes
        const nodeContent = JSON.stringify(location);
        const nodeMeta = {
          id: createNodeId(areaCode),
          internal: {
            type: 'Location',
            mediaType: 'application/json',
            content: nodeContent,
            contentDigest: createContentDigest(location),
          },
        };
        const node: NodeInput = { ...location, ...nodeMeta };
        createNode(node);
      }
    );
};
