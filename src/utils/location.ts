import { capitalCase } from 'change-case';

import { LocationItem, Summary } from '../types';

const getCumulativeCases = (summary: Summary) =>
  summary?.cases?.cumulative?.value ?? null;

const getPreviousDaysCases = (summary: Summary, days = 7) => {
  const values = summary?.cases?.recent?.values ?? null;
  return values
    ? values.slice(0, days).reduce(
        (accumulator: number, value) =>
          // How common is the null value?
          // Is it safe to skip, or better to try and load a previous value?
          value ? accumulator + value : accumulator,
        0
      )
    : null;
};

const per100kPopulation = (value: number | null, population?: number) =>
  value !== null && population ? value / (population / 100000) : null;

export const getPreviousDaysCasesPer100kPopulation = (
  summary: Summary,
  population?: number,
  days = 7
) => per100kPopulation(getPreviousDaysCases(summary, days), population);

// Sort (rank) locations based on their summary data
export const rankLocations = (
  summaryData: { [areaCode: string]: Summary },
  populationData: { [areaCode: string]: number },
  days = 7,
  tiebreakers = 7
) => ([areaCodeA]: LocationItem, [areaCodeB]: LocationItem) => {
  for (let offset = 0; offset <= tiebreakers; offset++) {
    const [sevenDayCasesPer100kA, sevenDayCasesPer100kB] = [
      areaCodeA,
      areaCodeB,
    ].map((areaCode) =>
      getPreviousDaysCasesPer100kPopulation(
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

export const formatAreaType = (areaType: string) =>
  areaType.slice(1) === 'tla' ? areaType.toUpperCase() : capitalCase(areaType);
