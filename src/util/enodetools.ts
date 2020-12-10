const leftPad = require('left-pad');
const padIpv6 = require('pad-ipv6');

export type Enode = {
  enodeId: string;
  ip: string;
  port: string;
};

export const enodeToParams = (enodeURL: string) => {
  let enodeId = '';
  let ip = '';
  let port = '';
  let extraParams = new Map();

  try {
    const node = new URL(enodeURL);
    if (node.protocol === 'enode:') {
      // Change to Special protocol in order to parse the fields properly
      node.protocol = 'https';

      if (node.username.length === 128) {
        enodeId = '0x' + node.username;
      }
      ip = parseHostname(node.hostname);
      port = node.port;

      node.searchParams.forEach((value, name, searchParams) => {
        extraParams.set(name.toLowerCase(), value);
      });
    }
  } catch (err) {}

  return {
    enodeId,
    ip,
    port,
    extraParams
  };
};

export const paramsToIdentifier = ({ enodeId, ip, port }: { enodeId: string; ip: string; port: string }) => {
  return `${enodeId}_${ip}_${port}`;
};

function parseHostname(stringHostname: string) {
  if (stringHostname[0] === '[') {
    const ipv6 = stringHostname.slice(1, -1);
    return getHexIpv6(ipv6);
  }
  return getHexIpv4(stringHostname);
}

function getHexIpv4(stringIp: string) {
  const splitIp = stringIp.split('.');
  return `0x00000000000000000000ffff${toHex(splitIp[0])}${toHex(splitIp[1])}${toHex(splitIp[2])}${toHex(splitIp[3])}`;
}

function getHexIpv6(stringIpv6: string) {
  const ipv6 = padIpv6(stringIpv6)
    .split(':')
    .join('');
  return '0x' + ipv6;
}

function toHex(number: string) {
  const num = Number(number).toString(16);
  return leftPad(num, 2, '0');
}

export const identifierToParams = (identifier: string) => {
  const [enodeId, ip, port] = identifier.split('_');
  return {
    enodeId,
    ip,
    port,
    identifier
  };
};

export const identifierToEnodeId = (identifier: string) => {
  if (identifier) {
    const [enodeHigh] = identifier.split('_');
    return `${enodeHigh}`;
  }
  return '';
};

export const isValidEnode = (str: string) => {
  return !Object.values(enodeToParams(str)).some(value => !value);
};

export const isEqual = (node1: Enode, node2: Enode) => {
  return (
    node1.enodeId.toLowerCase() === node2.enodeId.toLowerCase() && node1.ip === node2.ip && node1.port === node2.port
  );
};
