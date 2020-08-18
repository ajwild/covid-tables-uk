import { Link } from 'gatsby';
import React, { ReactElement } from 'react';
import { Row } from 'react-table';

type NameCellProps = {
  readonly row: Row<{ readonly slug: string }>;
  readonly value: string;
};

const NameCell = ({ row, value }: NameCellProps): ReactElement => (
  <Link to={row.original.slug}>{value}</Link>
);

export default NameCell;
