import { CORONAVIRUS_API_URL } from '../constants';
import { CoronavirusApiResponse } from '../types';
import { gotJsonLimited } from '../utils/limiter';

type ResponseDataItem = { [key: string]: string };
type ResponseData = ResponseDataItem[];

const makeRequest = async (
  areaType: string,
  dataFields: string[],
  nextUrl?: string
) => {
  const structure = dataFields.reduce<ResponseDataItem>(
    (accumulator, field) => ({ ...accumulator, [field]: field }),
    {}
  );
  const url =
    nextUrl ??
    `${CORONAVIRUS_API_URL}/v1/data?filters=areaType=${areaType}&page=1&structure=${JSON.stringify(
      structure
    )}`;

  return gotJsonLimited<CoronavirusApiResponse<ResponseDataItem>>(url);
};

export const getCoronavirusData = async (
  areaType: string,
  dataFields: string[],
  nextUrl?: string,
  data: ResponseData = []
): Promise<ResponseData> => {
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
