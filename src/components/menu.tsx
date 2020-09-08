import { Link } from 'gatsby';
import React, { MouseEvent, ReactElement } from 'react';
import { classes, media, style } from 'typestyle';

import { AREA_TYPES } from '../constants';
import { formatAreaType } from '../utils/location';

// eslint-disable-next-line functional/no-mixed-type
type MenuProps = {
  readonly areaTypeFilter: string | null;
  readonly handleMenuItemClick: (
    event: MouseEvent,
    areaType: string | null
  ) => void; // eslint-disable-line functional/no-return-void
};

const dropdownMenuClassName = style(
  {},
  media({ minWidth: 600 }, { display: 'none' })
);

const tabMenuClassName = style(
  { display: 'none' },
  media({ minWidth: 600 }, { display: 'flex' })
);

const Menu = ({
  areaTypeFilter,
  handleMenuItemClick,
}: MenuProps): ReactElement => (
  <>
    <div className={dropdownMenuClassName}>
      <div>{formatAreaType(areaTypeFilter)}</div>
      <ul>
        {[null, ...AREA_TYPES].map((areaType) => (
          <Link
            key={areaType ?? 'all'}
            className={areaTypeFilter === areaType ? 'active' : undefined}
            to={`/${areaType ? `?area-type=${areaType}` : ''}`}
            onClick={(event) => handleMenuItemClick(event, areaType)}
          >
            {formatAreaType(areaType)}
          </Link>
        ))}
      </ul>
    </div>
    <div className={classes('tabs', 'alt-theme', tabMenuClassName)}>
      {[null, ...AREA_TYPES].map((areaType) => (
        <Link
          key={areaType ?? 'all'}
          className={areaTypeFilter === areaType ? 'active' : undefined}
          to={`/${areaType ? `?area-type=${areaType}` : ''}`}
          onClick={(event) => handleMenuItemClick(event, areaType)}
        >
          {formatAreaType(areaType)}
        </Link>
      ))}
    </div>
  </>
);

export default Menu;
