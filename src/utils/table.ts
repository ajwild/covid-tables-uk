import NameCell from '../components/cells/name-cell';
import SparklineCell from '../components/cells/sparkline-cell';

export const defaultTableColumns = [
  {
    Header: 'Top',
    accessor: 'position',
  },
  {
    Header: 'Location',
    columns: [
      {
        Header: 'Name',
        accessor: 'areaName',
        Cell: NameCell,
      },
    ],
  },
  {
    Header: 'Cases',
    columns: [
      {
        Header: 'Total',
        accessor: 'summary.cases.cumulative.value',
      },
      {
        Header: 'New',
        accessor: 'summary.cases.new.value',
      },
      {
        Header: '7-day per 100k',
        accessor: 'casesPer100k',
      },
      {
        Header: 'Trend',
        accessor: 'summary.cases.recent.values',
        Cell: SparklineCell,
      },
    ],
  },
];
