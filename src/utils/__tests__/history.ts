import { CoronavirusItem } from '../../types';
import { prepareHistoryData } from '../history';

describe('utils/history', () => {
  describe('prepareHistoryData', () => {
    it('Groups data by area code', () => {
      const coronavirusData = [
        { areaCode: 'ABC123', date: '2020-01-01', value: 1 },
        { areaCode: 'DEF456', date: '2020-01-01', value: 2 },
        { areaCode: 'GHI789', date: '2020-01-01', value: 3 },
      ];

      const historyData = prepareHistoryData(
        (coronavirusData as unknown) as readonly CoronavirusItem[]
      );

      expect(historyData).toEqual({
        ABC123: [{ date: '2020-01-01', value: 1 }],
        DEF456: [{ date: '2020-01-01', value: 2 }],
        GHI789: [{ date: '2020-01-01', value: 3 }],
      });
    });

    it('Sorts grouped data by date', () => {
      const coronavirusData = [
        { areaCode: 'ABC123', date: '2020-01-01', value: 1 },
        { areaCode: 'ABC123', date: '2020-01-02', value: 2 },
        { areaCode: 'ABC123', date: '2020-01-05', value: 3 },
      ];

      const historyData = prepareHistoryData(
        (coronavirusData as unknown) as readonly CoronavirusItem[]
      );

      expect(historyData).toEqual({
        ABC123: [
          { date: '2020-01-05', value: 3 },
          { date: '2020-01-02', value: 2 },
          { date: '2020-01-01', value: 1 },
        ],
      });
    });
  });
});
