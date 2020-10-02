import { PageProps } from 'gatsby';
import React from 'react';
import { render } from '@testing-library/react';

import { HomeQuery } from '../../generated/gatsby-graphql';
import Home from '../pages';

describe('Home', () => {
  it('renders a table with all nodes', () => {
    const data = {
      locations: {
        edges: [
          { node: { areaName: 'England' } },
          { node: { areaName: 'Scotland' } },
        ],
      },
    };
    const mockedPageProps = {};

    const { getByRole } = render(
      <Home {...(mockedPageProps as PageProps<HomeQuery>)} data={data} />
    );

    expect(getByRole('table')).toBeInTheDocument();
    expect(getByRole('table').querySelectorAll('tbody > tr').length).toBe(2);
  });

  it('uses rank as the default sort value', () => {
    const data = {
      locations: {
        edges: [
          {
            node: {
              areaName: 'Scotland',
              rank: 20,
            },
          },
          {
            node: {
              areaName: 'England',
              rank: 10,
            },
          },
        ],
      },
    };
    const mockedPageProps = {};

    const { getByRole } = render(
      <Home {...(mockedPageProps as PageProps<HomeQuery>)} data={data} />
    );
    const tableRows = getByRole('table').querySelectorAll('tbody > tr');

    expect(tableRows[0]).toHaveTextContent('England');
    expect(tableRows[1]).toHaveTextContent('Scotland');
  });

  it('uses rank value for position when displaying all locations', () => {
    const data = {
      locations: {
        edges: [
          {
            node: {
              areaName: 'England',
              areaType: 'nation',
              rank: 10,
              rankByAreaType: 1,
            },
          },
          {
            node: {
              areaName: 'Scotland',
              areaType: 'nation',
              rank: 20,
              rankByAreaType: 2,
            },
          },
        ],
      },
    };
    const mockedPageProps = {};

    const { getByRole } = render(
      <Home {...(mockedPageProps as PageProps<HomeQuery>)} data={data} />
    );
    const tableRows = getByRole('table').querySelectorAll('tbody > tr');

    expect(tableRows[0]).toHaveTextContent('10');
    expect(tableRows[1]).toHaveTextContent('20');
  });
});
