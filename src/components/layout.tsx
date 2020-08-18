import React, { ReactElement, ReactNode } from 'react';
import { style } from 'typestyle';

import Header from './header';
import {
  backgroundColor,
  backgroundNoise,
  borderRadius,
  loadTheme,
  pageColor,
  primaryColor,
  shadowColor,
} from '../utils/theme';

loadTheme();

const backdropClassName = style({
  position: 'fixed',
  zIndex: -1,
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: backgroundColor.toHexString(),
  backgroundImage: `
    ${backgroundNoise},
    repeating-linear-gradient(
      105deg,
      transparent,
      transparent 49px,
      ${primaryColor.fade('15%').toString()} 49px,
      ${primaryColor.fade('15%').toString()} 50px
    ),
    radial-gradient(
      circle at 80% 20%,
      ${backgroundColor.lighten('10%').toHexString()} 0%,
      ${backgroundColor.darken('10%').toHexString()} 100%
    )
  `,
});

const mainClassName = style({
  margin: 'calc(var(--header-height-with-skew) + 1em) 0 2em',
  backgroundColor: pageColor.toHexString(),
  borderRadius,
  boxShadow: `0 0 4px ${String(shadowColor.toString())}`,
});

const Layout = ({
  children,
}: {
  readonly children: ReactNode;
}): ReactElement => (
  <>
    <div className={backdropClassName} />
    <Header />
    <div className="container">
      <main className={mainClassName}>{children}</main>
    </div>
  </>
);

export default Layout;
