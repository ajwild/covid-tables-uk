import { Reporter } from 'gatsby';

import { tryCacheWithFallback } from '../cache';

describe('utils/cache', () => {
  const mockedGatsbyCache = {
    get: jest.fn(),
    set: jest.fn(),
  };
  const cacheKey = 'location';
  const mockedReporter = ({ info: jest.fn() } as unknown) as Reporter;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('tryCacheWithFallback', () => {
    const fallbackFn = jest.fn();
    const fallbackArgs = ['test'];

    it('Calls fallback function with arguments when the cache is empty', async () => {
      const returnValue = ['hello', 'world'];
      fallbackFn.mockReturnValue(returnValue);

      const data = await tryCacheWithFallback(
        [mockedGatsbyCache, cacheKey, mockedReporter],
        fallbackFn,
        fallbackArgs
      );

      expect(fallbackFn).toHaveBeenCalledWith(...fallbackArgs);
      expect(data).toEqual(returnValue);
    });

    it('Uses the cache when available', async () => {
      const returnValue = ['hello', 'world'];
      mockedGatsbyCache.get.mockReturnValue({
        args: JSON.stringify(fallbackArgs),
        created: Date.now(),
        data: returnValue,
      });

      const data = await tryCacheWithFallback(
        [mockedGatsbyCache, cacheKey, mockedReporter],
        fallbackFn,
        fallbackArgs
      );

      expect(fallbackFn).not.toHaveBeenCalled();
      expect(data).toEqual(returnValue);
    });
  });
});
