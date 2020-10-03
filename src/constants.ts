export const AREA_TYPES = ['nation', 'region', 'utla' /* , 'ltla' */];
export const CORONAVIRUS_API_URL = 'https://api.coronavirus.data.gov.uk';
export const CORONAVIRUS_DATA_FIELDS = [
  'areaCode',
  'date',
  'cumAdmissions',
  'newAdmissions',
  'cumCasesByPublishDate',
  'newCasesByPublishDate',
  'cumCasesByPublishDateRate',
  'cumCasesBySpecimenDate',
  'newCasesBySpecimenDate',
  'cumCasesBySpecimenDateRate',
  'cumDeaths28DaysByPublishDate',
  'newDeaths28DaysByPublishDate',
  'cumTestsByPublishDate',
  'newTestsByPublishDate',
  // 'areaType',
  // 'areaName',
  // 'hash',
  // 'maleCases',
  // 'femaleCases',
  // 'cumPillarOneTestsByPublishDate',
  // 'newPillarOneTestsByPublishDate',
  // 'cumPillarTwoTestsByPublishDate',
  // 'newPillarTwoTestsByPublishDate',
  // 'cumPillarThreeTestsByPublishDate',
  // 'newPillarThreeTestsByPublishDate',
  // 'cumPillarFourTestsByPublishDate',
  // 'newPillarFourTestsByPublishDate',
  // 'cumAdmissionsByAge',
  // 'covidOccupiedMVBeds',
  // 'hospitalCases',
  // 'plannedCapacityByPublishDate',
];
export const DEFAULT_AREA_TYPE = 'nation';
export const LIMITER_MAX_CONCURRENT = 2;
export const LIMITER_MIN_TIME = 200;
export const MAX_CACHE_AGE = 1000 * 60 * 60 * 24;
export const ONS_API_URL = 'https://api.beta.ons.gov.uk';
export const SHOW_VERTICAL_RHYTHM_RULES = false;
