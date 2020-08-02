const { CORONAVIRUS_API_URL } = require('../constants');
const { gotJsonLimited } = require('../utils/limiter');

const makeRequest = (areaType, dataFields, nextUrl) => {
  const structure = dataFields.reduce(
    (accumulator, field) => ({ ...accumulator, [field]: field }),
    {}
  );
  const url =
    nextUrl ||
    `${CORONAVIRUS_API_URL}/v1/data?filters=areaType=${areaType}&page=1&structure=${JSON.stringify(
      structure
    )}`;

  return gotJsonLimited(url);
};

const getCoronavirusData = async (areaType, dataFields, nextUrl, data = []) => {
  const response = await makeRequest(areaType, dataFields, nextUrl);
  const mergedData = [...data, ...response.data];

  return response.pagination.next
    ? getCoronavirusData(
        areaType,
        dataFields,
        `${CORONAVIRUS_API_URL}${response.pagination.next}`,
        mergedData
      )
    : mergedData;
};

exports.getCoronavirusData = getCoronavirusData;
