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

  const tableData = useMemo(
    () =>
      [...tableLocations]
        .sort(({ node: a }, { node: b }) => Number(a.rank) - Number(b.rank))
        .map(({ node }) => {
          const casesPer100k = getPreviousDaysCasesPer100kPopulation(
            node.summary as Summary,
            Number(node.population)
          );
          return {
            ...node,
            position: node.rankByAreaType,
            casesPer100k: casesPer100k
              ? Math.round(casesPer100k * 10 ?? 0) / 10
              : null,
          };
        }),
    [tableLocations]
  );

  const tableProperties = {
    columns: tableColumns,
    data: tableData,
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
