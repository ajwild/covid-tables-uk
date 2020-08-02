import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';

// eslint-disable-next-line import/no-unassigned-import
import 'chota/dist/chota.min.css';

const Layout = ({ children, currentPath }) => (
  <div>
    <nav className="nav">
      <div className="nav-left">
        <Link className="brand" to="/">
          COVID-19 UK
        </Link>
        <div className="tabs">
          <Link className={currentPath === '/' ? 'active' : null} to="/">
            Home
          </Link>
        </div>
      </div>
    </nav>
    <main>{children}</main>
  </div>
);

Layout.propTypes = {
  children: PropTypes.node,
  currentPath: PropTypes.string,
};

export default Layout;
