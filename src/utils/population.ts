type Populations = Array<{ areaCode: string; population: number }>;
type PopulationData = { [areaCode: string]: number };

// Convert population data array to mapped object
export const preparePopulationData = (
  populations: Populations
): PopulationData =>
  populations.reduce(
    (accumulator, { areaCode, population }) => ({
      ...accumulator,
      [areaCode]: population,
    }),
    {}
  );
