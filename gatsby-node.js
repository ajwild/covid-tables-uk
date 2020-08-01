const { paramCase } = require('change-case');
const path = require('path');

const { AREA_TYPES } = require('./src/constants');
const { getCoronavirusData } = require('./src/sources/coronavirus');
const { getLocations } = require('./src/sources/locations');
const { getPopulations } = require('./src/sources/populations');

exports.createPages = async ({ graphql, actions }) => {
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
  createNodeId,
  createContentDigest,
}) => {
  const { createNode } = actions;

  // Load all data from APIs
  const locations = await getLocations(AREA_TYPES);
  const populations = await getPopulations();
  const groupedData = await Promise.all(
    AREA_TYPES.map((areaType) => getCoronavirusData(areaType))
  );
  const coronavirusData = groupedData.flat();

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
      id: createNodeId(location.areaCode),
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
