import { cssRaw, cssRule } from 'typestyle';
import { color } from 'csx';

import { SHOW_VERTICAL_RHYTHM_RULES } from '../constants';

const removeUnits = (value: string): number => Number.parseFloat(value);

export const backgroundColor = color('#bdd5ea');
export const highlightColor = color('#fe5f55');
export const navColor = color('#495867');
export const pageColor = color('#f7f7ff');
export const primaryColor = color('#557196');
export const textColor = color('#333');
export const textColorInverted = pageColor;
export const shadowColor = color('#000').fade('40%');

// Export const backgroundNoise =
//   'url(data:image/png;base64,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)';
export const backgroundNoise = 'url("/noise.png")';
export const borderRadius = '4px';

const minWidth = '20rem';
const maxWidth = '80rem';

const minBaseFontSize = '1em';
const maxBaseFontSize = '1.5em';

// eslint-disable-next-line functional/no-return-void
const loadVariables = (): void => {
  cssRaw(`
    :root {
      --page-width: 100vw;

      --header-height: 3em;
      --page-title-height: 3em;

      --layer1-angle: -2deg;
      --layer2-angle: -1.8deg;
      --layer3-angle: -1.4deg;

      --layer1-angle-tan: 0.034920769;
      --layer3-angle-tan: 0.024439474;
      --layer2-offset: 8px;
      --layer3-offset: 24px;
      --layer1-skew-padding-top: calc(100vw * (var(--layer1-angle-tan) / 2));
      --layer1-skew-padding-bottom: calc(var(--page-width) * (var(--layer1-angle-tan) / 2));
      --layer3-skew-size: calc(var(--layer3-offset) + ((var(--page-width) * var(--layer3-angle-tan)) / 2));
      --total-skew-size-bottom: calc(var(--layer1-skew-padding-bottom) + var(--layer3-skew-size));
      --header-height-with-skew: calc(var(--header-height) + var(--total-skew-size-bottom));

      --page-title-offset: calc(var(--header-height) + var(--layer1-skew-padding-bottom));
      --page-title-padding-top: var(--layer3-skew-size);
      --page-title-box-height: calc(var(--page-title-height) + var(--page-title-padding-top));

      --table-header-offset: calc(var(--page-title-offset) + var(--page-title-box-height));
    }

    @media (min-width: 80rem) {
      :root {
        --page-width: 80rem;
      }
    }
  `);
};

// eslint-disable-next-line functional/no-return-void
const loadElementStyles = (): void => {
  cssRule('html', {
    fontSize: '100%',
  });
  cssRule('body', {
    color: textColor.toHexString(),
    fontSize: [
      minBaseFontSize,
      `clamp(
        ${minBaseFontSize},
        calc(
          ${minBaseFontSize} +
          (${removeUnits(maxBaseFontSize)} - ${removeUnits(minBaseFontSize)}) * 
          (
            (100vw - ${minWidth}) / 
            (${removeUnits(maxWidth)} - ${removeUnits(minWidth)})
          )
        ),
        ${maxBaseFontSize}
      )`,
    ],
  });
  cssRule('a', {
    color: primaryColor.toHexString(),
    textDecoration: 'none',
    $nest: {
      '&:hover, &:focus': {
        color: primaryColor.darken('10%').toHexString(),
      },
    },
  });
  cssRule('h1, h2, h3, h4, h5, h6', {
    margin: 0,
    fontWeight: 'normal',
  });
  cssRule('table', {
    width: '100%',
    wordBreak: 'normal',
  });
  cssRule('th, td', {
    padding: '0.75em 1em',
  });
  cssRule('th', {
    fontWeight: 'normal',
    textAlign: 'left',
  });
};

// eslint-disable-next-line functional/no-return-void
const loadLayoutStyles = (): void => {
  cssRule(
    'body::before',
    SHOW_VERTICAL_RHYTHM_RULES
      ? {
          content: '""',
          position: 'absolute',
          top: '-17px',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          backgroundImage: `
            repeating-linear-gradient(
              to bottom,
              transparent 0,
              transparent calc(1.5em - 1px),
              #000 1.5em
            )
          `,
        }
      : {}
  );
  cssRule('.container', {
    minWidth,
    maxWidth,
    margin: '0 auto',
    padding: '0 1em',
  });
  cssRule('.content', {
    padding: '1em',
  });
};

// eslint-disable-next-line functional/no-return-void
export const loadTheme = (): void => {
  loadVariables();
  loadElementStyles();
  loadLayoutStyles();
};
