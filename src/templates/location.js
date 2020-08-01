import React from 'react';
import { graphql } from 'gatsby';

const Location = ({ data }) => {
  const location = data.allLocation.edges[0].node;
  console.log('location', location);

  return <div>{location.areaName}</div>;
};

export default Location;

export const query = graphql`
  query LocationQuery($id: String!) {
    allLocation(filter: { id: { eq: $id } }) {
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
`;
