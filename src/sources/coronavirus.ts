import { CORONAVIRUS_API_URL } from '../constants';
import { CoronavirusApiResponse, CoronavirusItem } from '../types';
import { gotJsonLimited } from '../utils/limiter';

const makeRequest = async (
  areaType: string,
  dataFields: readonly string[],
  nextUrl?: string
): Promise<CoronavirusApiResponse<CoronavirusItem>> => {
  const structure = dataFields.reduce<Partial<CoronavirusItem>>(
    (accumulator, field) => ({ ...accumulator, [field]: field }),
    {}
  );
  const url =
    nextUrl ??
    `${CORONAVIRUS_API_URL}/v1/data?filters=areaType=${areaType}&page=1&structure=${JSON.stringify(
      structure
    )}`;

  return gotJsonLimited<CoronavirusApiResponse<CoronavirusItem>>(url);
};

export const getCoronavirusData = async (
  areaType: string,
  dataFields: readonly string[],
  nextUrl?: string,
  data: readonly CoronavirusItem[] = []
): Promise<readonly CoronavirusItem[]> => {
  const response = await makeRequest(areaType, dataFields, nextUrl);
  const mergedData = [...data, ...response.data];

  return response.pagination.next
    ? getCoronavirusData(
        areaType,
        dataFields,
        `${CORONAVIRUS_API_URL}${String(response.pagination.next)}`,
        mergedData
      )
    : mergedData;
};
