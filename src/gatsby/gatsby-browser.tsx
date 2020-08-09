import { WrapPageElementBrowserArgs } from 'gatsby';
import React from 'react';
import { setStylesTarget } from 'typestyle';

import Layout from '../components/layout';

export const onInitialClientRender = () => {
  const stylesTarget = document.querySelector('#styles-target');
  if (stylesTarget) {
    setStylesTarget(stylesTarget);
  }
};

export const wrapPageElement = ({
  element,
  props,
}: WrapPageElementBrowserArgs) => <Layout {...props}>{element}</Layout>;
