import { capitalCase } from 'change-case';
import { Link, graphql, useStaticQuery } from 'gatsby';
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';

import Layout from '../components/layout';
import Table from '../components/table';
import { AREA_TYPES } from '../constants';

const NameCell = ({ row, value }) => (
  <Link to={row.original.slug}>{value}</Link>
);

NameCell.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      slug: PropTypes.string.isRequired,
    }),
  }),
  value: PropTypes.string.isRequired,
};

const Home = () => {
  const { allLocation } = useStaticQuery(graphql`
    query HomeQuery {
      allLocation {
        edges {
          node {
            areaName
            areaType
            rank
            slug
            summary {
              top
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
        accessor: 'areaType',
      },
      {
        Header: 'New Cases',
        accessor: 'cases',
      },
      {
        Header: 'Population',
        accessor: 'summary.top',
      },
      {
        Header: '7-day Cases per 100,000',
        accessor: 'cases100k',
      },
    ],
    []
  );

  const data = useMemo(
    () =>
      allLocation.edges
        .filter(
          ({ node }) => !areaTypeFilter || areaTypeFilter === node.areaType
        )
        .sort(({ node: a }, { node: b }) => a.rank - b.rank)
        .map(({ node }, index) => ({ ...node, position: index + 1 })),
    [allLocation.edges, areaTypeFilter]
  );
  console.log('data', data);

  return (
    <Layout>
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
            {capitalCase(areaType)}
          </a>
        ))}
      </nav>
      <Table columns={columns} data={data} />
    </Layout>
  );
};

export default Home;
