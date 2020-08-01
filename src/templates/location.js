import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';

import Layout from '../components/layout';

const Location = ({ data }) => {
  const location = data.allLocation.edges[0].node;
  console.log('location', location);

  return (
    <Layout>
      <h1>{location.areaName}</h1>
    </Layout>
  );
};

Location.propTypes = {
  data: PropTypes.shape({
    allLocation: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({ areaName: PropTypes.string }),
        })
      ),
    }),
  }),
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
