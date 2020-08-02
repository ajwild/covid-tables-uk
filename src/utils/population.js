// Convert population data array to mapped object
exports.preparePopulationData = (populations) =>
  populations.reduce(
    (accumulator, { areaCode, population }) => ({
      ...accumulator,
      [areaCode]: population,
    }),
    {}
  );
