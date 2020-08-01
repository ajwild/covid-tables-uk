const { paramCase } = require('change-case');
const path = require('path');

const { AREA_TYPES, MAX_CACHE_AGE } = require('./src/constants');
const { getCoronavirusData } = require('./src/sources/coronavirus');
const { getLocations } = require('./src/sources/locations');
const { getPopulations } = require('./src/sources/populations');

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

const tryCacheWithFallback = async (
  [cache, cacheKey, reporter],
  fallbackFn,
  fallbackArgs = []
) => {
  const args = JSON.stringify(fallbackArgs);
  const cacheResponse = await cache.get(cacheKey);

  if (
    cacheResponse &&
    Date.now() - cacheResponse.created <= MAX_CACHE_AGE &&
    cacheResponse.args === args
  ) {
    reporter.info(`Using cached data for "${cacheKey}"`);
    return cacheResponse.data;
  }

  const data = await fallbackFn(...fallbackArgs);
  reporter.info(`Adding "${cacheKey}" data to cache`);
  // Set cache but don't wait for promise to resolve
  cache.set(cacheKey, { args, created: Date.now(), data });
  return data;
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
    async (areaTypes) => {
      const groupedData = await Promise.all(
        areaTypes.map((areaType) => getCoronavirusData(areaType))
      );
      return groupedData.flat();
    },
    [AREA_TYPES]
  );

  // Convert population data array to mapped object
  const populationData = populations.reduce(
    (accumulator, { areaCode, population }) => ({
      ...accumulator,
      [areaCode]: population,
    }),
    {}
  );

  // Group coronavirus data by areaCode in mapped array
  const historyData = coronavirusData.reduce(
    (accumulator, data) => ({
      ...accumulator,
      [data.areaCode]: [
        ...(accumulator[data.areaCode] || []),
        {
          date: data.date,
          newCasesBySpecimenDate: data.newCasesBySpecimenDate,
        },
      ],
    }),
    {}
  );

  // Generate a summary of the history data for each areaCode
  const summaryData = Object.keys(historyData).reduce(
    (accumulator, areaCode) => ({
      ...accumulator,
      [areaCode]: {
        top: 1,
        // Add summary details
      },
    }),
    {}
  );

  // Sort (rank) locations based on their summary data
  const rankData = locations
    .sort(
      ([a], [b]) =>
        // Compare last 7 days per 100,000
        summaryData[a].cumCasesBySpecimenDate -
          summaryData[b].cumCasesBySpecimenDate ||
        // Go back to 8, 9, 10 days?
        summaryData[a].cumCasesBySpecimenDate -
          summaryData[b].cumCasesBySpecimenDate
    )
    .reduce(
      (accumulator, [areaCode], index) => ({
        ...accumulator,
        [areaCode]: index + 1,
      }),
      {}
    );

  locations.forEach(([areaCode, areaName, areaType]) => {
    // Combine calculated data
    const location = {
      areaCode,
      areaName,
      areaType,
      slug: `${areaType}/${paramCase(areaName)}`,
      population: populationData[areaCode],
      rank: rankData[areaCode],
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
