const { MAX_CACHE_AGE } = require('../constants');

exports.tryCacheWithFallback = async (
  [cache, cacheKey, reporter],
  fallbackFn,
  fallbackArgs = []
) => {
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
  // Set cache but don't wait for promise to resolve
  cache.set(cacheKey, { args, created: Date.now(), data });
  return data;
};
