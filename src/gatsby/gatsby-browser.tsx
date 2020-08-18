import { WrapPageElementBrowserArgs } from 'gatsby';
import React, { ReactElement } from 'react';
import { setStylesTarget } from 'typestyle';

import Layout from '../components/layout';

// eslint-disable-next-line functional/no-return-void
export const onInitialClientRender = (): void => {
  const stylesTarget = document.querySelector('#styles-target');
  if (stylesTarget) {
    setStylesTarget(stylesTarget);
  }
};

export const wrapPageElement = ({
  element,
  props,
}: WrapPageElementBrowserArgs): ReactElement => (
  <Layout {...props}>{element}</Layout>
);
