import { PopulationData, Populations } from '../types';

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
