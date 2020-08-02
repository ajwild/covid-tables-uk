exports.AREA_TYPES = ['nation', 'region', 'utla' /* , 'ltla' */];
exports.CORONAVIRUS_API_URL = 'https://api.coronavirus-staging.data.gov.uk';
exports.CORONAVIRUS_DATA_FIELDS = [
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
exports.MAX_CACHE_AGE = 1000 * 60 * 60 * 24;
exports.ONS_API_URL = 'https://api.beta.ons.gov.uk';
