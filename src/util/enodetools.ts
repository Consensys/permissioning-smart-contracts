// @ts-ignore
import utf8 from 'utf8';

export type Enode = {
  enodeHigh: string;
  enodeLow: string;
  ip: string;
  port: string;
  kind: number;
  geoHash: string;
  name: string;
};

export const enodeToParams = (enodeURL: string) => {
  let enodeHigh = '';
  let enodeLow = '';
  let ip = '';
  let port = '';

  const splitURL = enodeURL.split('//')[1];
  if (splitURL) {
    const [enodeId, rawIpAndPort] = splitURL.split('@');
    if (enodeId && enodeId.length === 128) {
      enodeHigh = '0x' + enodeId.slice(0, 64);
      enodeLow = '0x' + enodeId.slice(64);
    }
    if (rawIpAndPort) {
      const [ipAndPort] = rawIpAndPort.split('?');
      if (ipAndPort) {
        [ip, port] = ipAndPort.split(':');
      }
    }
  }
  return {
    enodeHigh,
    enodeLow,
    ip: ip ? getHexIpv4(ip) : '',
    port,
    kind: -1,
    name: 'Node Name'
  };
};

export const paramsToIdentifier = ({
  enodeHigh,
  enodeLow,
  ip,
  port
}: {
  enodeHigh: string;
  enodeLow: string;
  ip: string;
  port: string;
}) => {
  return `${enodeHigh}_${enodeLow}_${ip}_${port}`;
};

function getHexIpv4(stringIp: string) {
  const splitIp = stringIp.split('.');
  return `0x00000000000000000000ffff${toHex(splitIp[0])}${toHex(splitIp[1])}${toHex(splitIp[2])}${toHex(splitIp[3])}`;
}

function toHex(number: string) {
  const num = Number(number).toString(16);
  return num.length < 2 ? `0${num}` : num;
}

export const identifierToParams = (identifier: string) => {
  const [enodeHigh, enodeLow, ip, port] = identifier.split('_');
  return {
    enodeHigh,
    enodeLow,
    ip,
    port,
    identifier,
    kind: 0,
    geoHash: '',
    name: ''
  };
};

export const hexToUTF8 = (hex: string) => {
  let str = '';
  let code = 0;
  hex = hex.replace(/^0x/i, '');

  hex = hex.replace(/^(?:00)*/, '');
  hex = hex
    .split('')
    .reverse()
    .join('');
  hex = hex.replace(/^(?:00)*/, '');
  hex = hex
    .split('')
    .reverse()
    .join('');

  let l = hex.length;

  for (let i = 0; i < l; i += 2) {
    code = parseInt(hex.substr(i, 2), 16);
    str += String.fromCharCode(code);
  }

  return str;
};

export const identifierToEnodeHighAndLow = (identifier: string) => {
  if (identifier) {
    const [enodeHigh, enodeLow] = identifier.split('_');
    return `${enodeHigh}${enodeLow}`;
  }
  return '';
};

export const isValidEnode = (str: string) => {
  return !Object.values(enodeToParams(str)).some(value => !value);
};

export const isEqual = (node1: Enode, node2: Enode) => {
  return (
    node1.enodeHigh.toLowerCase() === node2.enodeHigh.toLowerCase() &&
    node1.enodeLow.toLowerCase() === node2.enodeLow.toLowerCase() &&
    node1.ip === node2.ip &&
    node1.port === node2.port
  );
};
