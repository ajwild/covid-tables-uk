const getDateString = (offset = 0) => {
  return new Date(new Date().setDate(new Date().getDate() + offset))
    .toISOString()
    .slice(0, 10);
};

const getDateDifference = (firstDate, secondDate) => {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round((Date.parse(firstDate) - Date.parse(secondDate)) / oneDay);
};

const getLatest = (field, list) => {
  const todaysDate = getDateString();
  const item = list.find(
    (item) => item[field] !== null && item.date < todaysDate
  );
  return item ? { date: item.date, value: item[field] } : null;
};

const getRecent = (field, list, days = 15) => {
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
    .fill()
    .map((_, dayOffset) => getDateString(startOffset - dayOffset));

  // Find date in list or return null
  let lastLoopIndex = startIndex;
  const values = dates.map((date) => {
    // For loop used as an optimisation to avoid unnecessary loops
    for (let i = lastLoopIndex; i < list.length; i++) {
      // Found matching date in list
      if (list[i].date === date) {
        lastLoopIndex = i + 1;
        return list[i][field];
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

const generateSummaryGroup = (summary, group, groupNames = ['']) => {
  const types = ['cumulative', 'new', 'recent'];
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
              summary[`${type}${field}`] ? accumulator + 1 : accumulator,
            0
          ),
      };
    })
    .sort((a, b) => b.count - a.count);
  const { field, groupBy } = groupResults[0];

  return types.reduce(
    (accumulator, type) => ({
      ...accumulator,
      [type]: summary[`${type.slice(0, 3)}${field}`],
    }),
    { groupBy }
  );
};

// Generate a summary of the history data for each areaCode
exports.prepareSummaryData = (historyData) =>
  Object.keys(historyData).reduce((accumulator, areaCode) => {
    const summary = {
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
      cumDeathsByDeathDate: getLatest(
        'cumDeathsByDeathDate',
        historyData[areaCode]
      ),
      newDeathsByDeathDate: getLatest(
        'newDeathsByDeathDate',
        historyData[areaCode]
      ),
      recDeathsByDeathDate: getRecent(
        'newDeathsByDeathDate',
        historyData[areaCode]
      ),
      cumDeathsByPublishDate: getLatest(
        'cumDeathsByPublishDate',
        historyData[areaCode]
      ),
      newDeathsByPublishDate: getLatest(
        'newDeathsByPublishDate',
        historyData[areaCode]
      ),
      recDeathsByPublishDate: getRecent(
        'newDeathsByPublishDate',
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

    const summaryGroups = {
      admissions: generateSummaryGroup(summary, 'Admissions'),
      cases: generateSummaryGroup(summary, 'Cases', [
        'SpecimenDate',
        'PublishDate',
      ]),
      deaths: generateSummaryGroup(summary, 'Deaths', [
        'DeathDate',
        'PublishDate',
      ]),
      tests: generateSummaryGroup(summary, 'Tests', ['PublishDate']),
    };

    return {
      ...accumulator,
      [areaCode]: {
        ...summary,
        ...summaryGroups,
      },
    };
  }, {});
