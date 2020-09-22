import { getStyles } from 'typestyle';

import { loadTheme } from '../theme';

describe('utils/theme', () => {
  describe('loadTheme', () => {
    it('Sets CSS values', () => {
      loadTheme();

      expect(typeof getStyles()).toStrictEqual('string');
    });
  });
});
