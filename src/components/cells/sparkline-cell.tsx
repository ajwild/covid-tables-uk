import React, { ReactElement } from 'react';
import { Sparklines, SparklinesBars } from 'react-sparklines';

import { primaryColor } from '../../utils/theme';

type NameCellProps = {
  readonly value: readonly number[];
};

const SparklineCell = ({ value: values }: NameCellProps): ReactElement | null =>
  values && values.length > 1 ? (
    <Sparklines
      data={values.map((_, index) => values[values.length - index - 1])}
      svgHeight={32}
      svgWidth={200}
    >
      <SparklinesBars
        style={{ fill: primaryColor.toHexString(), fillOpacity: 0.25 }}
      />
    </Sparklines>
  ) : null;

export default SparklineCell;
