import React, { /* MouseEvent, */ ReactElement /* useState */ } from 'react';
import { style } from 'typestyle';

// Import Menu from './menu';
// import { DEFAULT_AREA_TYPE } from '../constants';
import {
  backgroundNoise,
  highlightColor,
  navColor,
  primaryColor,
  shadowColor,
  textColorInverted,
} from '../utils/theme';

const navBackgroundGradientType = 'circle at 80%';
const navClassName = style({
  position: 'fixed',
  top: 'calc(0px - var(--layer1-skew-padding-top))',
  left: 0,
  right: 0,
  zIndex: 10,
  padding: 'var(--layer1-skew-padding-top) 0 var(--layer1-skew-padding-bottom)',
  $nest: {
    '& > *': {
      position: 'relative',
    },
    '& > .layer1, & > .layer2, & > .layer3': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      right: 0,
      boxShadow: `0 2px 2px ${shadowColor.toString()}`,
      transformOrigin: '50% 0',
      outline: '1px solid transparent',
      backfaceVisibility: 'hidden',
      filter: 'blur(0)',
    },
    '& > .layer1': {
      bottom: 0,
      zIndex: 0,
      backgroundColor: navColor.toHexString(),
      backgroundImage: `
        ${backgroundNoise},
        radial-gradient(
          ${navBackgroundGradientType},
          ${navColor.lighten('10%').toHexString()} 0%,
          ${navColor.darken('10%').toHexString()} 100%
        )
      `,
      transform: 'skewy(var(--layer1-angle))',
    },
    '& > .layer2': {
      bottom: 'calc(0px - var(--layer2-offset))',
      zIndex: -1,
      backgroundColor: highlightColor.toHexString(),
      backgroundImage: `
        ${backgroundNoise},
        radial-gradient(
          ${navBackgroundGradientType},
          ${highlightColor.lighten('10%').toHexString()} 0%,
          ${highlightColor.darken('10%').toHexString()} 100%
        )
      `,
      transform: 'skewy(var(--layer2-angle))',
    },
    '& > .layer3': {
      bottom: 'calc(0px - var(--layer3-offset))',
      zIndex: -2,
      backgroundColor: primaryColor.toHexString(),
      backgroundImage: `
        ${backgroundNoise},
        radial-gradient(
          ${navBackgroundGradientType},
          ${primaryColor.lighten('10%').toHexString()} 0%,
          ${primaryColor.darken('10%').toHexString()} 100%
        )
      `,
      transform: 'skewy(var(--layer3-angle))',
    },
  },
});

const titleClassName = style({
  margin: 0,
  padding: '0 0.5em',
  color: textColorInverted.toHexString(),
  fontSize: '2em',
});

const Header = (): ReactElement => {
  // Const [areaTypeFilter, setAreaTypeFilter] = useState<string | null>(
  //   DEFAULT_AREA_TYPE
  // );
  // const handleMenuItemClick = (event: MouseEvent, areaType: string | null) => {
  //   event.preventDefault();
  //   setAreaTypeFilter(areaType);
  // };

  return (
    <nav className={navClassName}>
      <div className="layer1" />
      <div className="layer2" />
      <div className="layer3" />
      <div className="container">
        <h1 className={titleClassName} data-testid="website-title">
          COVID-19 Tables UK
        </h1>
        {/* <Menu
          areaTypeFilter={areaTypeFilter}
          handleMenuItemClick={handleMenuItemClick}
        /> */}
      </div>
    </nav>
  );
};

export default Header;
