import got from 'got';

import { ONS_API_URL } from '../constants';
import { Populations } from '../types';

export const getPopulations = async (): Promise<Populations> => {
  const parameters = ['time=2019', 'sex=0', 'age=total', 'geography=*'];
  const path =
    '/v1/datasets/mid-year-pop-est/editions/mid-2019-april-2020-geography/versions/1/observations';

  const { observations: data } = await got(
    `${ONS_API_URL}${path}?${parameters.join('&')}`
  ).json<{
    readonly [key: string]: any;
    readonly observations: ReadonlyArray<{
      readonly [key: string]: any;
      readonly observation: string;
      readonly dimensions: {
        readonly [key: string]: any;
        readonly geography: {
          readonly [key: string]: any;
          readonly id: string;
        };
      };
    }>;
  }>();

  return data.map(({ observation, dimensions: { geography: { id } } }) => ({
    areaCode: id,
    population: Number(observation),
  }));
};
