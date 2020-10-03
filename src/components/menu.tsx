import { Link } from 'gatsby';
import React, { ReactElement, useContext } from 'react';
import { classes, style } from 'typestyle';

import { AREA_TYPES } from '../constants';
import AreaTypeFilterContext from '../contexts/area-type-filter';
import { formatAreaType } from '../utils/location';
import { backgroundColor, textColorInverted } from '../utils/theme';

type AreaType = string | null;

const menuClassName = style({
  margin: '1em 1em 0',
  display: 'flex',
  alignItems: 'center',
});

const menuItemClassName = style({
  marginRight: '1em',
  color: backgroundColor.toHexString(),
  $nest: {
    '&:last-of-type': {
      marginRight: 0,
    },
    '&:hover, &:focus': {
      color: textColorInverted.toHexString(),
    },
  },
});

const menuItemActiveClassName = style({
  color: textColorInverted.toHexString(),
  textDecoration: 'underline',
});

const Menu = (): ReactElement => {
  const [areaTypeFilter, setAreaTypeFilter] = useContext(AreaTypeFilterContext);

  const handleMenuItemClick = (areaType: AreaType): AreaType => {
    setAreaTypeFilter(areaType);

    return areaType;
  };

  const isActive = (areaType: AreaType): boolean => areaType === areaTypeFilter;

  return (
    <div className={menuClassName}>
      {AREA_TYPES.map((areaType) => (
        <Link
          key={areaType ?? 'all'}
          className={classes(
            menuItemClassName,
            isActive(areaType) ? menuItemActiveClassName : null
          )}
          to="/"
          onClick={() => handleMenuItemClick(areaType)}
        >
          {formatAreaType(areaType, true)}
        </Link>
      ))}
    </div>
  );
};

export default Menu;
