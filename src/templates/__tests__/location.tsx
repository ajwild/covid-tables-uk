import React from 'react';
import { render } from '@testing-library/react';

import { PageProps } from 'gatsby';

import Location from '../location';
import { LocationQuery } from '../../../generated/gatsby-graphql';

describe('Location', () => {
  it('renders site title', () => {
    const data = {
      location: {
        edges: [{ node: { areaName: 'England' } }],
      },
      tableLocations: {
        edges: [{ node: { areaName: 'England' } }],
      },
    };
    const mockedPageProps = {};

    const { getByRole } = render(
      <Location
        {...(mockedPageProps as PageProps<LocationQuery>)}
        data={data}
      />
    );

    const title = getByRole('heading');
    expect(title).toHaveTextContent('England');
  });

  it('includes a table', () => {
    const data = {
      location: {
        edges: [{ node: { areaName: 'England' } }],
      },
      tableLocations: {
        edges: [{ node: { areaName: 'England' } }],
      },
    };
    const mockedPageProps = {};

    const { getByRole } = render(
      <Location
        {...(mockedPageProps as PageProps<LocationQuery>)}
        data={data}
      />
    );

    const table = getByRole('table');
    expect(table).toBeInTheDocument();
  });
});
