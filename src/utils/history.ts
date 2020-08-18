import { CoronavirusItem, HistoryData } from '../types';

export const prepareHistoryData = (
  coronavirusData: readonly CoronavirusItem[]
): HistoryData => {
  // Group coronavirus data by areaCode in mapped array
  const historyDataRaw: HistoryData = coronavirusData.reduce<HistoryData>(
    (accumulator, { areaCode, ...data }) => ({
      ...accumulator,
      [areaCode]: [...(accumulator[areaCode] || []), { ...data }],
    }),
    {}
  );

  // Ensure history is in correct order - don't rely on API
  return Object.keys(historyDataRaw).reduce<HistoryData>(
    (accumulator, areaCode) => ({
      ...accumulator,
      [areaCode]: [...historyDataRaw[areaCode]].sort((a, b) =>
        a.date > b.date ? -1 : 1
      ),
    }),
    {}
  );
};
