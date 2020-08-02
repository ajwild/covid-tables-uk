const getCumulativeCases = (summary) => {
  const { cases: { cumulative: { value = null } = {} } = {} } = summary;
  return value;
};

const getPreviousDaysCases = (summary, days = 7) => {
  const { cases: { recent: { values } = {} } = {} } = summary;
  return values
    ? values
        .slice(0, days)
        .reduce((accumulator, value) => accumulator + value, 0)
    : null;
};

const per100kPopulation = (value, population) =>
  value !== null && population ? value / (population / 100000) : null;

exports.getPreviousDaysCasesPer100kPopulation = (
  summary,
  population,
  days = 7
) => per100kPopulation(getPreviousDaysCases(summary, days), population);

// Sort (rank) locations based on their summary data
exports.rankLocations = (
  summaryData,
  populationData,
  days = 7,
  tiebreakers = 7
) => ([areaCodeA], [areaCodeB]) => {
  for (let offset = 0; offset <= tiebreakers; offset++) {
    const [sevenDayCasesPer100kA, sevenDayCasesPer100kB] = [
      areaCodeA,
      areaCodeB,
    ].map((areaCode) =>
      exports.getPreviousDaysCasesPer100kPopulation(
        summaryData[areaCode],
        populationData[areaCode],
        days + offset
      )
    );

    if (sevenDayCasesPer100kA === null && sevenDayCasesPer100kB !== null) {
      return 1;
    }

    if (sevenDayCasesPer100kA !== null && sevenDayCasesPer100kB === null) {
      return -1;
    }

    if (
      sevenDayCasesPer100kA !== null &&
      sevenDayCasesPer100kB !== null &&
      sevenDayCasesPer100kA !== sevenDayCasesPer100kB
    ) {
      return sevenDayCasesPer100kA - sevenDayCasesPer100kB;
    }
  }

  // Try sorting by total cumulative cases
  const cumulativeCasesA = getCumulativeCases(summaryData[areaCodeA]);
  const cumulativeCasesB = getCumulativeCases(summaryData[areaCodeB]);
  if (
    cumulativeCasesA !== null &&
    cumulativeCasesB !== null &&
    cumulativeCasesA !== cumulativeCasesB
  ) {
    return cumulativeCasesA - cumulativeCasesB;
  }

  // Fallback to sorting by areaCode
  return areaCodeA > areaCodeB ? 1 : -1;
};
