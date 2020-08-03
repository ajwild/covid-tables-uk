import got from 'got';

import { ONS_API_URL } from '../constants';

export const getPopulations = async () => {
  const parameters = ['time=2019', 'sex=0', 'age=total', 'geography=*'];
  const path =
    '/v1/datasets/mid-year-pop-est/editions/mid-2019-april-2020-geography/versions/1/observations';

  const { observations: data } = await got(
    `${ONS_API_URL}${path}?${parameters.join('&')}`
  ).json<{
    [key: string]: any;
    observations: Array<{
      [key: string]: any;
      observation: string;
      dimensions: {
        [key: string]: any;
        geography: {
          [key: string]: any;
          id: string;
        };
      };
    }>;
  }>();

  return data.map(({ observation, dimensions: { geography: { id } } }) => ({
    areaCode: id,
    population: Number(observation),
  }));
};
