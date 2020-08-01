const got = require('got');

const { ONS_API_URL } = require('../constants');

const getPopulations = async () => {
  const parameters = ['time=2019', 'sex=0', 'age=total', 'geography=*'];
  const path =
    '/v1/datasets/mid-year-pop-est/editions/mid-2019-april-2020-geography/versions/1/observations';

  const { observations: data } = await got(
    `${ONS_API_URL}${path}?${parameters.join('&')}`
  ).json();

  return data.map(
    ({
      observation: population,
      dimensions: {
        geography: { id },
      },
    }) => ({
      areaCode: id,
      population,
    })
  );
};

exports.getPopulations = getPopulations;
