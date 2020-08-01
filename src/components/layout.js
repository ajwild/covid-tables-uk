import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';

// eslint-disable-next-line import/no-unassigned-import
import 'milligram/dist/milligram.min.css';

const Layout = ({ children }) => {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
      </nav>
      <main>{children}</main>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
