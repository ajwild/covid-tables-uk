import {
  getPreviousDaysCasesPer100kPopulation,
  rankLocations,
  formatAreaType,
} from '../location';
import { Summary } from '../../types';

describe('utils/location', () => {
  describe('getPreviousDaysCasesPer100kPopulation', () => {
    it('Calculates value from recent cases', () => {
      const population = 200000;
      const summary = {
        cases: {
          recent: {
            values: new Array(30).fill(10),
          },
        },
      };

      const cases = getPreviousDaysCasesPer100kPopulation(
        (summary as unknown) as Summary,
        population
      );

      expect(cases).toStrictEqual(35);
    });

    it('Returns null if the data is missing', () => {
      const population = 100000;
      const summary = {};

      const cases = getPreviousDaysCasesPer100kPopulation(
        (summary as unknown) as Summary,
        population
      );

      expect(cases).toStrictEqual(null);
    });

    it('Returns 0 if no data is available', () => {
      const population = 100000;
      const summary = {
        cases: {
          recent: {
            values: [],
          },
        },
      };

      const cases = getPreviousDaysCasesPer100kPopulation(
        (summary as unknown) as Summary,
        population
      );

      expect(cases).toStrictEqual(0);
    });

    it('Treats missing data as 0 cases', () => {
      const population = 100000;
      const summary = {
        cases: {
          recent: {
            values: [10, 20, 10, null, null, 20, 10, 20, null],
          },
        },
      };

      const cases = getPreviousDaysCasesPer100kPopulation(
        (summary as unknown) as Summary,
        population
      );

      expect(cases).toStrictEqual(70);
    });

    it('Calculates averages for different lengths of time', () => {
      const population = 100000;
      const summary = {
        cases: {
          recent: {
            values: new Array(30).fill(10),
          },
        },
      };
      const days = 14;

      const cases = getPreviousDaysCasesPer100kPopulation(
        (summary as unknown) as Summary,
        population,
        days
      );

      expect(cases).toStrictEqual(140);
    });
  });

  describe.skip('rankLocations', () => {
    it('returns a number to sort by', () => {
      // To be implemented
      rankLocations({}, {});
    });
  });

  describe('formatAreaType', () => {
    it('Makes the area type pretty', () => {
      const areaType = 'nation';

      const result = formatAreaType(areaType);

      expect(typeof result).toStrictEqual('string');
      expect(result).not.toStrictEqual(areaType);
    });

    it('Returns "All Locations" when null is provided', () => {
      const areaType = null;

      const result = formatAreaType(areaType);

      expect(result).toMatch(/^all locations$/i);
    });

    it('Returns "Unknown" when a value is not found in the map', () => {
      const areaType = 'anything';

      const result = formatAreaType(areaType);

      expect(result).toMatch(/^unknown$/i);
    });
  });
});
