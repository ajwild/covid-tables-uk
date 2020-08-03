import { GatsbyCache, Reporter } from 'gatsby';

import { MAX_CACHE_AGE } from '../constants';

export const tryCacheWithFallback = async (
  [cache, cacheKey, reporter]: [GatsbyCache, string, Reporter],
  fallbackFn: (...args: any[]) => Promise<any> | any,
  fallbackArgs: any[] = []
): Promise<any> => {
  const args = JSON.stringify(fallbackArgs);
  const cacheResponse = await cache.get(cacheKey);

  if (
    cacheResponse &&
    Date.now() - cacheResponse.created <= MAX_CACHE_AGE &&
    cacheResponse.args === args
  ) {
    reporter.info(`Using cached data for "${cacheKey}"`);
    return cacheResponse.data;
  }

  const data = await fallbackFn(...fallbackArgs);

  reporter.info(`Adding "${cacheKey}" data to cache`);
  await cache.set(cacheKey, { args, created: Date.now(), data });

  return data;
};
