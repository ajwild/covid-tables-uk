const { paramCase } = require('change-case');
const path = require('path');

const { AREA_TYPES, CORONAVIRUS_DATA_FIELDS } = require('./src/constants');
const { getCoronavirusData } = require('./src/sources/coronavirus');
const { getLocations } = require('./src/sources/locations');
const { getPopulations } = require('./src/sources/populations');
const { tryCacheWithFallback } = require('./src/utils/cache');
const { prepareHistoryData } = require('./src/utils/history');
const { rankLocations } = require('./src/utils/location');
const { preparePopulationData } = require('./src/utils/population');
const { prepareSummaryData } = require('./src/utils/summary');

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;

  // Load all locations
  const { data } = await graphql(
    `
      query loadPagesQuery {
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
  data.allLocation.edges.forEach(({ node }) => {
    createPage({
      path: node.slug,
      component: path.resolve(`./src/templates/location.js`),
      context: node,
    });
  });
};

exports.sourceNodes = async ({
  actions,
  cache,
  createContentDigest,
  createNodeId,
  reporter,
}) => {
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
    async (areaTypes, dataFields) => {
      const groupedData = await Promise.all(
        areaTypes.map((areaType) => getCoronavirusData(areaType, dataFields))
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
    .forEach(([areaCode, areaName, areaType], index) => {
      // Combine calculated data
      const location = {
        areaCode,
        areaName,
        areaType,
        slug: `${areaType}/${paramCase(areaName)}`,
        population: populationData[areaCode],
        rank: index + 1,
        history: historyData[areaCode],
        summary: summaryData[areaCode],
      };

      // Add to Gatsby nodes
      const nodeContent = JSON.stringify(location);
      const nodeMeta = {
        id: createNodeId(areaCode),
        parent: null,
        children: [],
        internal: {
          type: `Location`,
          mediaType: `application/json`,
          content: nodeContent,
          contentDigest: createContentDigest(location),
        },
      };
      createNode({ ...location, ...nodeMeta });
    });
};
