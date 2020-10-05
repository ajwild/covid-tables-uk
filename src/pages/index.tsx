import { graphql, PageProps } from 'gatsby';
import React, { ReactElement, useContext, useMemo } from 'react';
import { style } from 'typestyle';

import PageTitle from '../components/page-title';
import Table from '../components/table';
import AreaTypeFilterContext from '../contexts/area-type-filter';
import { Summary } from '../types';
import { HomeQuery } from '../../generated/gatsby-graphql';
import {
  formatAreaType,
  getPreviousDaysCasesPer100kPopulation,
} from '../utils/location';
import { defaultTableColumns } from '../utils/table';
import { borderRadius } from '../utils/theme';

const Home = ({ data: { locations } }: PageProps<HomeQuery>): ReactElement => {
  const tableColumns = useMemo(() => defaultTableColumns, []);

  const [areaTypeFilter] = useContext(AreaTypeFilterContext);

  const tableData = useMemo(
    () =>
      locations.edges
        .filter(
          ({ node }) => !areaTypeFilter || areaTypeFilter === node.areaType
        )
        .sort(({ node: a }, { node: b }) => Number(a.rank) - Number(b.rank))
        .map(({ node }) => {
          const casesPer100k = getPreviousDaysCasesPer100kPopulation(
            node.summary as Summary,
            Number(node.population)
          );
          return {
            ...node,
            position: areaTypeFilter ? node.rankByAreaType : node.rank,
            casesPer100k: casesPer100k
              ? Math.round(casesPer100k * 10 ?? 0) / 10
              : null,
          };
        }),
    [locations.edges, areaTypeFilter]
  );

  const tableProperties = {
    columns: tableColumns,
    data: tableData,
  };

  const tableColClassName = style({
    margin: 0,
    $nest: {
      'table > tbody > tr > td:first-of-type': {
        borderBottomLeftRadius: borderRadius,
      },
      'table > tbody > tr > td:last-of-type': {
        borderBottomRightRadius: borderRadius,
      },
    },
  });

  return (
    <>
      <PageTitle text={formatAreaType(areaTypeFilter, true, true)} />
      <div className={tableColClassName}>
        <Table {...tableProperties} />
      </div>
    </>
  );
};

export default Home;

export const query = graphql`
  query Home {
    locations: allLocation {
      edges {
        node {
          areaName
          areaType
          population
          rank
          rankByAreaType
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
`;
