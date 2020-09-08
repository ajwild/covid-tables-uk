import Bottleneck from 'bottleneck';
import got, { OptionsOfJSONResponseBody } from 'got';

import { LIMITER_MAX_CONCURRENT, LIMITER_MIN_TIME } from '../constants';

const limiter = new Bottleneck({
  maxConcurrent: LIMITER_MAX_CONCURRENT,
  minTime: LIMITER_MIN_TIME,
});

export const gotJsonLimited = async <T>(
  url: string,
  options: OptionsOfJSONResponseBody = {}
): Promise<T> => limiter.schedule(() => got(url, options).json());
