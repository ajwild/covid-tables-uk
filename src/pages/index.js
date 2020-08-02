import { graphql, useStaticQuery } from 'gatsby';
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';

import NameCell from '../components/cells/name-cell';
import Layout from '../components/layout';
import Table from '../components/table';
import { AREA_TYPES } from '../constants';
import {
  formatAreaType,
  getPreviousDaysCasesPer100kPopulation,
} from '../utils/location';

const Home = ({ path }) => {
  const { allLocation } = useStaticQuery(graphql`
    query HomeQuery {
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

  const [areaTypeFilter, setAreaTypeFilter] = useState(null);
  const handleTabClick = (event, areaType) => {
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
        accessor: ({ areaType }) => formatAreaType(areaType),
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
        .sort(({ node: a }, { node: b }) => a.rank - b.rank)
        .map(({ node }, index) => ({
          ...node,
          position: index + 1,
          casesPer100k:
            Math.round(
              getPreviousDaysCasesPer100kPopulation(
                node.summary,
                node.population
              ) * 10
            ) / 10,
        })),
    [allLocation.edges, areaTypeFilter]
  );
  console.log('data', data);

  return (
    <Layout currentPath={path}>
      <h1>Home</h1>
      <nav className="tabs">
        <a
          className={areaTypeFilter ? null : 'active'}
          href="#"
          onClick={(event) => handleTabClick(event, null)}
        >
          All
        </a>
        {AREA_TYPES.map((areaType) => (
          <a
            key={areaType}
            className={areaTypeFilter === areaType ? 'active' : null}
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

Home.propTypes = {
  path: PropTypes.string,
};

export default Home;
