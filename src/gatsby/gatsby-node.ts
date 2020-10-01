import { paramCase } from 'change-case';
import {
  CreatePagesArgs,
  CreateWebpackConfigArgs,
  GatsbyNode,
  NodeInput,
  SourceNodesArgs,
} from 'gatsby';
import { resolve } from 'path';

import { AREA_TYPES, CORONAVIRUS_DATA_FIELDS } from '../constants';
import { CreateLocationPagesQuery } from '../../generated/gatsby-graphql';
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
              areaType
              id
              rankByAreaType
              slug
            }
          }
        }
      }
    `
  );

  // Count locations by areaType
  const areaTypeCounts = data?.allLocation?.edges?.reduce<{
    readonly [areaType: string]: number;
  }>(
    (accumulator, { node: { areaType } }) =>
      areaType
        ? { ...accumulator, [areaType]: (accumulator[areaType] || 0) + 1 }
        : accumulator,
    {}
  );

  // Create page for each location
  data?.allLocation?.edges?.forEach(
    ({ node: { areaType, id, rankByAreaType, slug } }) => {
      const displayRanks: readonly number[] =
        areaType && areaTypeCounts && rankByAreaType
          ? [
              1,
              2,
              3,
              rankByAreaType - 2,
              rankByAreaType - 1,
              rankByAreaType,
              rankByAreaType + 1,
              rankByAreaType + 2,
              areaTypeCounts[areaType] - 2,
              areaTypeCounts[areaType] - 1,
              areaTypeCounts[areaType],
            ]
          : [];
      const uniqueDisplayRanks = displayRanks.reduce<readonly number[]>(
        (accumulator, value) =>
          accumulator.includes(value) || value === 0
            ? accumulator
            : [...accumulator, value],
        []
      );

      createPage({
        path: slug as string,
        component: resolve('./src/templates/location.tsx'),
        context: {
          id,
          areaType,
          displayRanks: uniqueDisplayRanks,
        },
      });
    }
  );
};

export const onCreateWebpackConfig = ({
  actions,
}: // eslint-disable-next-line functional/no-return-void
CreateWebpackConfigArgs): void => {
  actions.setWebpackConfig({
    node: {
      fs: 'empty',
    },
    resolve: {
      modules: [resolve(__dirname, 'src'), 'node_modules'],
    },
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
    async (areaTypes: readonly string[], dataFields: readonly string[]) => {
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

  [...locations]
    .sort(rankLocations(summaryData, populationData))
    .reduce<{ readonly [areaType: string]: number }>(
      (
        accumulator,
        [areaCode, areaName, areaType]: readonly [string, string, string],
        index: number
      ) => {
        // Combine calculated data
        const location = {
          areaCode,
          areaName,
          areaType,
          slug: `/${areaType}/${String(paramCase(areaName))}`,
          population: populationData[areaCode],
          rank: index + 1,
          rankByAreaType: (accumulator[areaType] || 0) + 1,
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

        return { ...accumulator, [areaType]: (accumulator[areaType] || 0) + 1 };
      },
      {}
    );
};
