import { graphql, useStaticQuery } from 'gatsby';
import React, { useMemo } from 'react';
import { style } from 'typestyle';

import NameCell from '../components/cells/name-cell';
import PageTitle from '../components/page-title';
import Table from '../components/table';
import { Summary } from '../types';
import { HomeQuery } from '../../generated/gatsby-graphql';
import {
  formatAreaType,
  getPreviousDaysCasesPer100kPopulation,
} from '../utils/location';

const Home = () => {
  const { allLocation }: HomeQuery = useStaticQuery(graphql`
    query Home {
      allLocation {
        edges {
          node {
            areaName
            areaType
            population
            rank
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
  `);

  const columns = useMemo(
    () => [
      {
        Header: 'Top',
        accessor: 'position',
      },
      {
        Header: 'Name',
        accessor: 'areaName',
        Cell: NameCell,
      },
      {
        Header: 'Type',
        accessor: ({ areaType }: { areaType: string }) =>
          formatAreaType(areaType),
        id: 'areaType',
      },
      {
        Header: 'Total Cases',
        accessor: 'summary.cases.cumulative.value',
      },
      {
        Header: 'New Cases',
        accessor: 'summary.cases.new.value',
      },
      {
        Header: '7-day Cases per 100,000',
        accessor: 'casesPer100k',
      },
    ],
    []
  );

  const areaTypeFilter = null;
  const hiddenColumns = useMemo(() => (areaTypeFilter ? ['areaType'] : []), [
    areaTypeFilter,
  ]);

  const data = useMemo(
    () =>
      allLocation.edges
        .filter(
          ({ node }) => !areaTypeFilter || areaTypeFilter === node.areaType
        )
        .sort(({ node: a }, { node: b }) => Number(a.rank) - Number(b.rank))
        .map(({ node }, index) => {
          const casesPer100k = getPreviousDaysCasesPer100kPopulation(
            node.summary as Summary,
            Number(node.population)
          );
          return {
            ...node,
            position: Number(index) + 1,
            casesPer100k: casesPer100k
              ? Math.round(casesPer100k * 10 ?? 0) / 10
              : null,
          };
        }),
    [allLocation.edges, areaTypeFilter]
  );

  const tableProperties = {
    columns,
    data,
    hiddenColumns,
    title: formatAreaType(areaTypeFilter),
  };

  const tableColClassName = style({
    margin: 0,
  });

  return (
    <>
      <PageTitle text={formatAreaType(areaTypeFilter)} />
      <div className={tableColClassName}>
        <Table {...tableProperties} />
      </div>
    </>
  );
};

export default Home;
