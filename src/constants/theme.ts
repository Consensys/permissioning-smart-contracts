const baseColors = {
  black: '#202328',
  white: '#FFF',
  blue: '#36ADF1',
  green: '#01D49A',
  yellow: '#FD9D28',
  red: '#DC2C10',
  blurple: '#CCD8E1',
  consensysblue: '#2C56DD',
  protocol: '#2C56DD'
};

export default {
  palette: {
    primary: {
      main: baseColors.protocol
    },
    secondary: {
      main: baseColors.green
    }
  },
  typography: {
    h1: {
      fontSize: '3.65rem',
      fontWeight: 340
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 400
    },
    h3: {
      fontSize: '1.75rem'
    }
  }
};
