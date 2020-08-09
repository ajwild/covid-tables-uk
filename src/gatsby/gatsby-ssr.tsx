import { readFileSync } from 'fs';
import { RenderBodyArgs, WrapPageElementNodeArgs } from 'gatsby';
import React from 'react';
import { createTypeStyle, getStyles } from 'typestyle';

import Layout from '../components/layout';

const createStyleElement = (id: string, style: string) => (
  <style
    key={id}
    // eslint-disable-next-line react/no-danger
    dangerouslySetInnerHTML={{ __html: style }}
    id={id}
  />
);

export const onRenderBody = ({ setHeadComponents }: RenderBodyArgs) => {
  const globalStyles = createTypeStyle();
  [
    'node_modules/sanitize.css/sanitize.css',
    // 'node_modules/sanitize.css/forms.css',
    'node_modules/sanitize.css/typography.css',
  ].forEach((cssPath) => globalStyles.cssRaw(readFileSync(cssPath, 'utf8')));

  const globalStyleElement = createStyleElement(
    'styles-target-global',
    globalStyles.getStyles()
  );
  const styleElement = createStyleElement('styles-target', getStyles());

  setHeadComponents([globalStyleElement, styleElement]);
};

export const wrapPageElement = ({
  element,
  props,
}: WrapPageElementNodeArgs) => <Layout {...props}>{element}</Layout>;
