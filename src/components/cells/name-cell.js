import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';

const NameCell = ({ row, value }) => (
  <Link to={row.original.slug}>{value}</Link>
);

NameCell.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      slug: PropTypes.string.isRequired,
    }),
  }),
  value: PropTypes.string.isRequired,
};

export default NameCell;
