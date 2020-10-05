import { Link } from 'gatsby';
import React, { ReactElement } from 'react';
import { Row } from 'react-table';

type NameCellProps = {
  readonly row: Row<{ readonly slug: string }>;
  readonly value: string;
};

const NameCell = ({ row, value }: NameCellProps): ReactElement | null =>
  value ? <Link to={row.original.slug}>{value}</Link> : null;

export default NameCell;
