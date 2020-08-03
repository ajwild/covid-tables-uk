import { Link } from 'gatsby';
import React, { PropsWithChildren } from 'react';

// eslint-disable-next-line import/no-unassigned-import
import 'chota/dist/chota.min.css';

type LayoutProps = { currentPath?: string };

const Layout = ({ children, currentPath }: PropsWithChildren<LayoutProps>) => (
  <div>
    <nav className="nav">
      <div className="nav-left">
        <Link className="brand" to="/">
          COVID-19 UK
        </Link>
        <div className="tabs">
          <Link className={currentPath === '/' ? 'active' : undefined} to="/">
            Home
          </Link>
        </div>
      </div>
    </nav>
    <main>{children}</main>
  </div>
);

export default Layout;
