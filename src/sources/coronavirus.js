const { CORONAVIRUS_API_URL } = require('../constants');
const { gotJsonLimited } = require('../utils');

const makeRequest = (areaType, nextUrl) => {
  const structure = {
    areaCode: 'areaCode',
    date: 'date',
    newCasesBySpecimenDate: 'newCasesBySpecimenDate',
    cumCasesByPublishDate: 'cumCasesByPublishDate',
  };
  const url =
    nextUrl ||
    `${CORONAVIRUS_API_URL}/v1/data?filters=areaType=${areaType}&page=1&structure=${JSON.stringify(
      structure
    )}`;

  return gotJsonLimited(url);
};

const getCoronavirusData = async (areaType, nextUrl, data = []) => {
  const response = await makeRequest(areaType, nextUrl);
  const mergedData = [...data, ...response.data];

  return response.pagination.next
    ? getCoronavirusData(areaType, response.pagination.next, mergedData)
    : mergedData;
};

exports.getCoronavirusData = getCoronavirusData;
