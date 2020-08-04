import { graphql, useStaticQuery, PageProps } from 'gatsby';
import React, { MouseEvent, useMemo, useState } from 'react';

import NameCell from '../components/cells/name-cell';
import Layout from '../components/layout';
import Table from '../components/table';
import { AREA_TYPES } from '../constants';
import { Summary } from '../types';
import { HomeQuery } from '../../generated/gatsby-graphql';
import {
  formatAreaType,
  getPreviousDaysCasesPer100kPopulation,
} from '../utils/location';

const Home = ({ path }: PageProps) => {
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

  const [areaTypeFilter, setAreaTypeFilter] = useState<string | null>(null);
  const handleTabClick = (event: MouseEvent, areaType: string | null) => {
    event.preventDefault();
    setAreaTypeFilter(areaType);
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Position',
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
        Header: 'Cases',
        accessor: 'summary.cases.cumulative.value',
      },
      {
        Header: 'New Cases',
        accessor: 'summary.cases.new.value',
      },
      {
        Header: 'Population',
        accessor: 'population',
      },
      {
        Header: '7-day Cases per 100,000',
        accessor: 'casesPer100k',
      },
    ],
    []
  );

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
            position: index + 1,
            casesPer100k: casesPer100k
              ? Math.round(casesPer100k * 10 ?? 0) / 10
              : null,
          };
        }),
    [allLocation.edges, areaTypeFilter]
  );
  console.log('data', data);

  return (
    <Layout currentPath={path}>
      <h1>Home</h1>
      <nav className="tabs">
        <a
          className={areaTypeFilter ? undefined : 'active'}
          href="#"
          onClick={(event) => handleTabClick(event, null)}
        >
          All
        </a>
        {AREA_TYPES.map((areaType) => (
          <a
            key={areaType}
            className={areaTypeFilter === areaType ? 'active' : undefined}
            href="#"
            onClick={(event) => handleTabClick(event, areaType)}
          >
            {formatAreaType(areaType)}
          </a>
        ))}
      </nav>
      <Table columns={columns} data={data} hiddenColumns={hiddenColumns} />
    </Layout>
  );
};

export default Home;
