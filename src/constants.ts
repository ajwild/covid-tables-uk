export const AREA_TYPES = ['nation', 'region' /* , 'utla', 'ltla' */];
export const CORONAVIRUS_API_URL = 'https://api.coronavirus.data.gov.uk';
export const CORONAVIRUS_DATA_FIELDS = [
  'areaCode',
  'date',
  'cumAdmissions',
  'newAdmissions',
  'cumCasesByPublishDate',
  'newCasesByPublishDate',
  'cumCasesBySpecimenDate',
  'newCasesBySpecimenDate',
  'cumDeathsByDeathDate',
  'newDeathsByDeathDate',
  'cumDeathsByPublishDate',
  'newDeathsByPublishDate',
  'cumTestsByPublishDate',
  'newTestsByPublishDate',
  // 'hash',
  // 'areaName',
  // 'areaType',
  // 'femaleCases',
  // 'maleCases',
  // 'femaleDeaths',
  // 'maleDeaths',
  // 'covidOccupiedMVBeds',
  // 'hospitalCases',
  // 'plannedCapacityByPublishDate',
  // 'cumAdmissionsByAge',
  // 'cumPillarOneTestsByPublishDate',
  // 'newPillarOneTestsByPublishDate',
  // 'cumPillarTwoTestsByPublishDate',
  // 'newPillarTwoTestsByPublishDate',
  // 'cumPillarThreeTestsByPublishDate',
  // 'newPillarThreeTestsByPublishDate',
  // 'cumPillarFourTestsByPublishDate',
  // 'newPillarFourTestsByPublishDate',
];
export const DEFAULT_AREA_TYPE = AREA_TYPES[0];
export const MAX_CACHE_AGE = 1000 * 60 * 60 * 24;
export const ONS_API_URL = 'https://api.beta.ons.gov.uk';
export const SHOW_VERTICAL_RHYTHM_RULES = false;
