import {
  formatAreaType,
  getAreaTypeExpansion,
  getPreviousDaysCasesPer100kPopulation,
  rankLocations,
} from '../location';
import { Summary } from '../../types';

describe('utils/location', () => {
  describe('formatAreaType', () => {
    it('Makes the area type pretty', () => {
      expect(formatAreaType('nation')).toStrictEqual('Nation');
    });

    it('Returns "Unknown" when falsy value is provided', () => {
      expect(formatAreaType(null)).toMatch(/^unknown$/i);
    });

    it('Returns "Unknown" when a value is not found in the map', () => {
      expect(formatAreaType('anything')).toMatch(/^unknown$/i);
    });

    it('Returns an adjective when the "adjective" style is requested', () => {
      expect(formatAreaType('nation', true)).toMatch(/^national$/i);
    });

    it('Returns the default format when an expansion is not available', () => {
      expect(formatAreaType('utla', true)).toMatch(/^utla$/i);
    });

    it('Returns an expansion of an acronym when the "long" style is requested', () => {
      expect(formatAreaType('utla', false, true)).toMatch(/^upper tier local authority$/i);
    });

    it('Returns the default format when the "long" style is not available', () => {
      expect(formatAreaType('nation', false, true)).toMatch(/^nation$/i);
    });

    it('Returns an expansion of an acronym when the "adjective" and "long" styles are requested', () => {
      expect(formatAreaType('utla', true, true)).toMatch(/^upper tier local authority$/i);
    });

    it('Returns an adjective when the "adjective" and "long" styles are requested', () => {
      expect(formatAreaType('nation', true, true)).toMatch(/^national$/i);
    });
  });

  describe('getAreaTypeExpansion', () => {
    it('Returns expansion when acronym is passed', () => {
      expect(getAreaTypeExpansion('utla')).toBe('Upper Tier Local Authority');
      expect(getAreaTypeExpansion('ltla')).toBe('Lower Tier Local Authority');
    });

    it('Returns undefined when full string is passed', () => {
      expect(getAreaTypeExpansion('nation')).toBeUndefined();
    });
  });

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
});
