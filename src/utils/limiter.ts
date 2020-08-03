import Bottleneck from 'bottleneck';
import got, { OptionsOfJSONResponseBody } from 'got';

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 500,
});

export const gotJsonLimited = async <T>(
  url: string,
  options: OptionsOfJSONResponseBody = {}
): Promise<T> => limiter.schedule(() => got(url, options).json());
