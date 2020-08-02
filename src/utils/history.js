exports.prepareHistoryData = (coronavirusData) => {
  // Group coronavirus data by areaCode in mapped array
  const historyDataRaw = coronavirusData.reduce(
    (accumulator, { areaCode, ...data }) => ({
      ...accumulator,
      [areaCode]: [...(accumulator[areaCode] || []), { ...data }],
    }),
    {}
  );
  // Ensure history is in correct order - don't rely on API
  return Object.keys(historyDataRaw).reduce(
    (accumulator, areaCode) => ({
      ...accumulator,
      [areaCode]: historyDataRaw[areaCode].sort((a, b) =>
        a.date > b.date ? -1 : 1
      ),
    }),
    {}
  );
};
