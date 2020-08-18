import { CORONAVIRUS_API_URL } from '../constants';
import { CoronavirusApiResponse, LocationItem } from '../types';
import { gotJsonLimited } from '../utils/limiter';

export const getLocations = async (
  areaTypes: readonly string[]
): Promise<readonly LocationItem[]> => {
  const structure = ['areaCode', 'areaName', 'areaType'];

  const { data } = await gotJsonLimited<
    CoronavirusApiResponse<readonly [string, string, string]>
  >(
    `${CORONAVIRUS_API_URL}/v1/lookup?filters=areaType=${areaTypes.join(
      '|areaType='
    )}&structure=${JSON.stringify(structure)}`
  );

  return data;
};
