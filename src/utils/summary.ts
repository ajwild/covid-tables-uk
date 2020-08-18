import {
  HistoryData,
  Summary,
  SummaryGroupItem,
  SummaryGroups,
  SummaryItemLatest,
  SummaryItems,
} from '../types';

const getDateString = (offset = 0) => {
  return new Date(new Date().setDate(new Date().getDate() + offset))
    .toISOString()
    .slice(0, 10);
};

const getDateDifference = (firstDate: string, secondDate: string) => {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round((Date.parse(firstDate) - Date.parse(secondDate)) / oneDay);
};

const getLatest = (
  field: string,
  list: Array<{ [key: string]: any }>
): SummaryItemLatest => {
  const todaysDate = getDateString();
  const item = list.find(
    (item) => item[field] !== null && item.date < todaysDate
  );
  return item ? { date: item.date, value: item[field] } : null;
};

const getRecent = (
  field: string,
  list: Array<{
    [key: string]: any;
    date: string;
  }>,
  days = 15
) => {
  // Get first non-null item from list
  const todaysDate = getDateString();
  const startIndex = list.findIndex(
    (item) => item[field] !== null && item.date < todaysDate
  );
  if (startIndex === -1) {
    return null;
  }

  // Make an array of recent dates
  const startDate = list[startIndex].date;
  const startOffset = getDateDifference(startDate, todaysDate);
  const dates = new Array(days)
    .fill(null)
    .map((_, dayOffset) => getDateString(startOffset - dayOffset));

  // Find date in list or return null
  let lastLoopIndex = startIndex;
  const values = dates.map((date) => {
    // For loop used as an optimisation to avoid unnecessary loops
    for (let i = lastLoopIndex; i < list.length; i++) {
      // Found matching date in list
      if (list[i].date === date) {
        lastLoopIndex = i + 1;
        return list[i][field] as number;
      }

      // List is ordered so there is no need to keep searching
      if (list[i].date < date) {
        break;
      }
    }

    return null;
  });

  return { startDate, values };
};

const generateSummaryGroup = (
  summary: SummaryItems,
  group: string,
  groupNames = ['']
): SummaryGroupItem => {
  const types: Array<keyof SummaryGroupItem> = ['cumulative', 'new', 'recent'];
  const groupResults = groupNames
    .map((groupName) => {
      const field = groupName ? `${group}By${groupName}` : group;
      return {
        field,
        groupBy: groupName || null,
        count: types
          .map((type) => type.slice(0, 3))
          .reduce(
            (accumulator, type) =>
              summary[`${type}${field}` as keyof SummaryItems]
                ? accumulator + 1
                : accumulator,
            0
          ),
      };
    })
    .sort((a, b) => b.count - a.count);
  const { field, groupBy } = groupResults[0];

  return types.reduce(
    (accumulator, type) => ({
      ...accumulator,
      [type]: summary[`${type.slice(0, 3)}${field}` as keyof SummaryItems],
    }),
    // Not sure why, but using reduce type parameter causes linter errors
    // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
    { groupBy } as SummaryGroupItem
  );
};

// Generate a summary of the history data for each areaCode
export const prepareSummaryData = (
  historyData: HistoryData
): { [areaCode: string]: Summary } =>
  Object.keys(historyData).reduce<{ [areaCode: string]: Summary }>(
    (accumulator, areaCode) => {
      const summary: SummaryItems = {
        cumAdmissions: getLatest('cumAdmissions', historyData[areaCode]),
        newAdmissions: getLatest('newAdmissions', historyData[areaCode]),
        recAdmissions: getRecent('newAdmissions', historyData[areaCode]),
        cumCasesByPublishDate: getLatest(
          'cumCasesByPublishDate',
          historyData[areaCode]
        ),
        newCasesByPublishDate: getLatest(
          'newCasesByPublishDate',
          historyData[areaCode]
        ),
        recCasesByPublishDate: getRecent(
          'newCasesByPublishDate',
          historyData[areaCode]
        ),
        cumCasesBySpecimenDate: getLatest(
          'cumCasesBySpecimenDate',
          historyData[areaCode]
        ),
        newCasesBySpecimenDate: getLatest(
          'newCasesBySpecimenDate',
          historyData[areaCode]
        ),
        recCasesBySpecimenDate: getRecent(
          'newCasesBySpecimenDate',
          historyData[areaCode]
        ),
        cumDeaths28DaysByPublishDate: getLatest(
          'cumDeaths28DaysByPublishDate',
          historyData[areaCode]
        ),
        newDeaths28DaysByPublishDate: getLatest(
          'newDeaths28DaysByPublishDate',
          historyData[areaCode]
        ),
        recDeaths28DaysByPublishDate: getRecent(
          'newDeaths28DaysByPublishDate',
          historyData[areaCode]
        ),
        cumTestsByPublishDate: getLatest(
          'cumTestsByPublishDate',
          historyData[areaCode]
        ),
        newTestsByPublishDate: getLatest(
          'newTestsByPublishDate',
          historyData[areaCode]
        ),
        recTestsByPublishDate: getRecent(
          'newTestsByPublishDate',
          historyData[areaCode]
        ),
      };

      const summaryGroups: SummaryGroups = {
        admissions: generateSummaryGroup(summary, 'Admissions'),
        cases: generateSummaryGroup(summary, 'Cases', [
          'SpecimenDate',
          'PublishDate',
        ]),
        deaths: generateSummaryGroup(summary, 'Deaths28Days', ['PublishDate']),
        tests: generateSummaryGroup(summary, 'Tests', ['PublishDate']),
      };

      return {
        ...accumulator,
        [areaCode]: {
          ...summary,
          ...summaryGroups,
        },
      };
    },
    {}
  );
