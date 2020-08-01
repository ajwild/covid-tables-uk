import { Link, graphql, useStaticQuery } from 'gatsby';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import Table from '../components/table';

// eslint-disable-next-line import/no-unassigned-import
import 'milligram/dist/milligram.min.css';

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

  const columns = useMemo(
    () => [
      {
        Header: 'Position',
        accessor: 'rank',
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

  const data = useMemo(() => allLocation.edges.map(({ node }) => node), [
    allLocation.edges,
  ]);
  console.log('data', data);

  return (
    <div>
      <h1>Home</h1>
      <Table columns={columns} data={data} />
      {/* {allLocation.edges.map(({ node }) => (
        <p key={node.areaCode}>
          <Link to={node.slug}>{node.areaName}</Link>
        </p>
      ))} */}
    </div>
  );
};

export default Home;
