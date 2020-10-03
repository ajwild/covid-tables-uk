import { graphql, PageProps } from 'gatsby';
import React, { ReactElement, useMemo } from 'react';

import NameCell from '../components/cells/name-cell';
import PageTitle from '../components/page-title';
import Table from '../components/table';
import { LocationQuery } from '../../generated/gatsby-graphql';
import { Summary } from '../types';
import { getPreviousDaysCasesPer100kPopulation } from '../utils/location';

const Location = ({ data }: PageProps<LocationQuery>): ReactElement => {
  const location = data.location.edges[0].node;
  const tableLocations = data.tableLocations.edges;

  const tableColumns = useMemo(
    () => [
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
        ],
      },
    ],
    []
  );

  type TableRow = {
    readonly position?: number | string | null;
    readonly casesPer100k?: number | null;
    readonly areaName?: string | null;
    readonly areaType?: string | null;
    readonly population?: number | null;
    readonly rank?: number | null;
    readonly rankByAreaType?: number | null;
    readonly slug?: string | null;
    readonly summary?: Partial<Summary> | null;
  };

  const tableData = useMemo(
    () =>
      [...tableLocations]
        .sort(({ node: a }, { node: b }) => Number(a.rank) - Number(b.rank))
        .reduce<readonly TableRow[]>((accumulator, { node }) => {
          const casesPer100k = getPreviousDaysCasesPer100kPopulation(
            node.summary as Summary,
            Number(node.population)
          );
          const tableRow: TableRow = {
            ...(node as TableRow),
            position: node.rankByAreaType,
            casesPer100k: casesPer100k
              ? Math.round(casesPer100k * 10 ?? 0) / 10
              : null,
          };

          const hasGap =
            accumulator[accumulator.length - 1] &&
            accumulator[accumulator.length - 1].rankByAreaType !==
              (node.rankByAreaType ?? 0) - 1;

          return hasGap
            ? [...accumulator, { position: '...' }, tableRow]
            : [...accumulator, tableRow];
        }, []),
    [tableLocations]
  );

  const tableProperties = {
    columns: tableColumns,
    // eslint-disable-next-line functional/prefer-readonly-type
    data: tableData as TableRow[],
    sortable: false,
  };

  return (
    <>
      <PageTitle text={location.areaName as string} />
      <Table {...tableProperties} />
    </>
  );
};

export default Location;

export const query = graphql`
  query Location($areaType: String!, $displayRanks: [Int]!, $id: String!) {
    location: allLocation(filter: { id: { eq: $id } }) {
      edges {
        node {
          areaName
          areaType
          rank
          rankByAreaType
          slug
        }
      }
    }
    tableLocations: allLocation(
      filter: {
        areaType: { eq: $areaType }
        rankByAreaType: { in: $displayRanks }
      }
    ) {
      edges {
        node {
          areaName
          areaType
          population
          rank
          rankByAreaType
          slug
          summary {
            cases {
              cumulative {
                date
                value
              }
              new {
                date
                value
              }
              recent {
                startDate
                values
              }
              groupBy
            }
            deaths {
              cumulative {
                date
                value
              }
              new {
                date
                value
              }
              groupBy
            }
          }
        }
      }
    }
  }
`;
