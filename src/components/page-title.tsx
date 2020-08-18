import React, { ReactElement } from 'react';
import { style } from 'typestyle';

import {
  backgroundNoise,
  borderRadius,
  primaryColor,
  shadowColor,
  textColorInverted,
} from '../utils/theme';

type PageTitleProps = {
  readonly text: string;
};

const tableTitleRowClassName = style({
  position: 'sticky',
  top: 'var(--page-title-offset)',
  zIndex: 5,
  backgroundColor: primaryColor.toHexString(),
  backgroundImage: backgroundNoise,
  borderRadius: `${String(borderRadius)} ${String(borderRadius)} 0 0`,
  boxShadow: `0 2px 2px ${shadowColor.toString()}`,
  color: textColorInverted.toHexString(),
});

const tableTitleClassName = style({
  padding: 'var(--page-title-padding-top) 0.5em 0',
});

const PageTitle = ({ text }: PageTitleProps): ReactElement => (
  <div className={tableTitleRowClassName}>
    <h1 className={tableTitleClassName}>{text}</h1>
  </div>
);

export default PageTitle;
