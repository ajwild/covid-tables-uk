import { Link } from 'gatsby';
import React from 'react';
import { Row } from 'react-table';

type NameCellProps = {
  row: Row<{ slug: string }>;
  value: string;
};

const NameCell = ({ row, value }: NameCellProps) => (
  <Link to={row.original.slug}>{value}</Link>
);

export default NameCell;
