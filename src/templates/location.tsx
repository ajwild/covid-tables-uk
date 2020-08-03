import { graphql, PageProps } from 'gatsby';
import React from 'react';

import Layout from '../components/layout';
import { LocationQuery } from '../types/generated/gatsby-graphql';

const Location = ({ data }: PageProps<LocationQuery>) => {
  const location = data.allLocation.edges[0].node;

  return (
    <Layout>
      <h1>{location.areaName}</h1>
    </Layout>
  );
};

export default Location;

export const query = graphql`
  query Location($id: String!) {
    allLocation(filter: { id: { eq: $id } }) {
      edges {
        node {
          areaName
          areaType
          rank
          slug
        }
      }
    }
  }
`;
