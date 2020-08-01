import React, { useMemo } from 'react';
import { Link, graphql, useStaticQuery } from 'gatsby';

import Table from '../components/table';

// eslint-disable-next-line import/no-unassigned-import
import 'milligram/dist/milligram.min.css';

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
        Cell: ({ row, value }) => <Link to={row.original.slug}>{value}</Link>,
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
