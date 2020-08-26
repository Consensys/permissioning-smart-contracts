// @ts-ignore
import request from 'request';
import web3 from 'web3';
// @ts-ignore
import ngeohash from 'ngeohash';

export type Enode = {
  enodeHigh: string;
  enodeLow: string;
  ip: string;
  port: string;
  nodeType: number;
  geoHash: string;
  organization: string;
  name: string;
};

const splitAddress = (address: string, digits: number) => {
  const bits: string[] = [];

  while (address.length >= digits) {
    bits.push(address.slice(0, digits));
    address = address.slice(digits);
  }
  return bits;
};

const getIpv4 = (address: string) => {
  const ipv4Prefix = '00000000000000000000ffff';
  return splitAddress(address.split(ipv4Prefix)[1], 2)
    .map(hex => {
      return parseInt(hex, 16);
    })
    .join('.');
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
    nodeType: -1,
    name: 'Node Name'
  };
};

export const getGeohash = (ip: string) =>
  new Promise<string>(resolve => {
    let url = `http://api.ipstack.com/${getIpv4(ip)}?access_key=67332e46b2ec77d406cffe607d152297`;
    request(
      {
        url: url,
        method: 'GET',
        json: true
      },
      (error: any, response: any, body: any) => {
        if (response.statusCode !== 200) {
          resolve(web3.utils.asciiToHex('0x000000'));
        }

        if (body.success === false) {
          resolve(web3.utils.asciiToHex('0x000000'));
        }

        if (typeof body.latitude !== 'undefined') {
          const geoHash = ngeohash.encode(body.latitude, body.longitude, 6);
          console.log(body, geoHash);
          resolve(web3.utils.asciiToHex(geoHash));
        }
        resolve(web3.utils.asciiToHex('0x000000'));
      }
    );
  });

export const paramsToIdentifier = ({
  enodeHigh,
  enodeLow,
  ip,
  port,
  nodeType,
  geoHash,
  name,
  organization
}: {
  enodeHigh: string;
  enodeLow: string;
  ip: string;
  port: string;
  nodeType: number;
  geoHash: string;
  name: string;
  organization: string;
}) => {
  return `${enodeHigh}_${enodeLow}_${ip}_${port}_${nodeType}_${geoHash}_${name}_${organization}`;
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
  const [enodeHigh, enodeLow, ip, port, nodeType, geoHash, name, organization] = identifier.split('_');
  return {
    enodeHigh,
    enodeLow,
    ip,
    port,
    identifier,
    nodeType: parseInt(nodeType),
    geoHash,
    organization,
    name
  };
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
