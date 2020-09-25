import { tint, shade, readableColor } from 'polished';

// rimble base colors
const baseColors = {
  black: '#202328',
  white: '#FFF',
  blue: '#36ADF1',
  green: '#01D49A',
  yellow: '#FD9D28',
  red: '#DC2C10',
  blurple: '#CCD8E1',
  consensysblue: '#2C56DD',
  pegasys: '#2C56DD'
};

// rimble palette
const colors = {
  pegasys: {
    base: baseColors.pegasys,
    text: readableColor(baseColors.pegasys),
    light: [null, tint(0.2, baseColors.pegasys)],
    dark: [null, shade(0.2, baseColors.pegasys)]
  },
  blurple: {
    base: baseColors.blurple,
    text: readableColor(baseColors.blurple),
    light: [null, tint(0.2, baseColors.blurple)],
    dark: [null, shade(0.2, baseColors.blurple)]
  },
  blue: {
    base: baseColors.blue,
    text: readableColor(baseColors.blue),
    light: [null, tint(0.9, baseColors.blue)],
    dark: [null, shade(0.4, baseColors.blue)]
  },
  green: {
    base: baseColors.green,
    text: baseColors.white,
    light: [null, tint(0.9, baseColors.green)],
    dark: [null, shade(0.4, baseColors.green)]
  },
  yellow: {
    base: baseColors.yellow,
    text: readableColor(baseColors.yellow),
    light: [null, tint(0.9, baseColors.yellow)],
    dark: [null, shade(0.4, baseColors.yellow)]
  },
  red: {
    base: baseColors.red,
    text: readableColor(baseColors.red),
    light: [null, tint(0.9, baseColors.red)],
    dark: [null, shade(0.4, baseColors.red)]
  }
};

const pegasys = colors.pegasys;
const blurple = colors.blurple;
const blue = colors.blue;
const green = colors.green;
const yellow = colors.yellow;
const red = colors.red;

export { pegasys };
export { blurple };
export { blue };
export { green };
export { yellow };
export { red };

export default baseColors;
