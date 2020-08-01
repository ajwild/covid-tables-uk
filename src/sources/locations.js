const { CORONAVIRUS_API_URL } = require('../constants');
const { gotJsonLimited } = require('../utils');

const getLocations = async (areaTypes) => {
  const structure = ['areaCode', 'areaName', 'areaType'];

  const { data } = await gotJsonLimited(
    `${CORONAVIRUS_API_URL}/v1/lookup?filters=areaType=${areaTypes.join(
      '|areaType='
    )}&structure=${JSON.stringify(structure)}`
  );

  return data;
};

exports.getLocations = getLocations;
