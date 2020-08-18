import { graphql, PageProps } from 'gatsby';
import React, { ReactElement } from 'react';

import PageTitle from '../components/page-title';
import { LocationQuery } from '../../generated/gatsby-graphql';

const Location = ({ data }: PageProps<LocationQuery>): ReactElement => {
  const location = data.allLocation.edges[0].node;

  return <PageTitle text={location.areaName as string} />;
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
