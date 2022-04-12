// @ts-ignore
import request from 'request';
import web3 from 'web3';
// @ts-ignore
import ngeohash from 'ngeohash';
//import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';

// export type Enode = {
//   enodeId: string;
//   host: string;
//   port: string;
// };

//modify struct enode
export type Enode = {
  enodeHigh: string;
  enodeLow: string;
  ip: string;
  port: string;
  nodeType: number;
  geoHash: string;
  organization: string;
  name: string;
  did: string;
  group: string;
};

export type EnodeTransaction = {
  enodeHigh: string;
  enodeLow: string;
  ip: string;
  port: string;
  nodeType: number;
  geoHash: string;
  organization: string;
  name: string;
  did: string;
  group: string;
  executed:boolean ;
  transactionId:number ;
};
//split addres to bit
const splitAddress = (address: string, digits: number) => {
  const bits: string[] = [];

  while (address.length >= digits) {
    bits.push(address.slice(0, digits));
    address = address.slice(digits);
  }
  return bits;
};

//ip String to bytes16
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
  //let group = '';

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
   // group: '0x4BB48E76F19DE6EBED7D59D46800508030AECEA46BA56BD19855D94473E28BC0'
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
        
          resolve(web3.utils.asciiToHex(geoHash));
        }
        resolve(web3.utils.asciiToHex('0x000000'));
      }
    );
  });

// export const paramsToIdentifier = ({ enodeId, host, port }: { enodeId: string; host: string; port: string }) => {
//   return `${enodeId}_${host}_${port}`;
// };

export const paramsToIdentifier = ({
  enodeHigh,
  enodeLow,
  ip,
  port,
  nodeType,
  geoHash,
  name,
  organization,
  did,
  group
}: {
  enodeHigh: string;
  enodeLow: string;
  ip: string;
  port: string;
  nodeType: number;
  geoHash: string;
  name: string;
  organization: string;
  did: string;
  group: string;
}) => {
  return `${enodeHigh}_${enodeLow}_${ip}_${port}_${nodeType}_${geoHash}_${name}_${organization}_${did}_${group}`;
};

export const paramsToIdentifierTransaction = ({
  enodeHigh,
  enodeLow,
  ip,
  port,
  nodeType,
  geoHash,
  name,
  organization,
  did,
  group,
  executed,
  transactionId
}: {
  enodeHigh: string;
  enodeLow: string;
  ip: string;
  port: string;
  nodeType: number;
  geoHash: string;
  name: string;
  organization: string;
  did: string;
  group: string;
  executed:boolean ;
  transactionId:number ;
}) => {
  return `${enodeHigh}_${enodeLow}_${ip}_${port}_${nodeType}_${geoHash}_${name}_${organization}_${did}_${group}_${executed}_${transactionId}`;
};


function getHexIpv4(stringIp: string) {
  const splitIp = stringIp.split('.');
  return `0x00000000000000000000ffff${toHex(splitIp[0])}${toHex(splitIp[1])}${toHex(splitIp[2])}${toHex(splitIp[3])}`;
}

function toHex(number: string) {
  const num = Number(number).toString(16);
  return num.length < 2 ? `0${num}` : num;
}

// export const identifierToParams = (identifier: string) => {
//   const [enodeId, host, port] = identifier.split('_');
//   return {
//     enodeId,
//     host,
//     port,
//     identifier
//   };
// };
export const identifierToParams = (identifier: string) => {
  const [enodeHigh, enodeLow, ip, port, nodeType, geoHash, name, organization, did, group] = identifier.split('_');
  let type = 0;
  if (typeof nodeType === 'string') {
    type = ['Bootnode', 'Validator', 'Writer', 'Observer'].indexOf(nodeType);
  } else {
    type = parseInt(nodeType);
  }

  return {
    enodeHigh,
    enodeLow,
    ip,
    port,
    identifier,
    nodeType: type,
    geoHash,
    organization,
    name,
    did,
    group
  };
};

export const identifierToParamsTransaction = (identifier: string) => {
  const [enodeHigh, enodeLow, ip, port, nodeType, geoHash, name, organization, did, group, executed, transactionId] = identifier.split('_');
  let type = 0;
  let execute=false;
  let transaction = 0;
  if (typeof nodeType === 'string') {
    type = ['Bootnode', 'Validator', 'Writer', 'Observer'].indexOf(nodeType);
  } else {
    type = parseInt(nodeType);
  }

  if (typeof executed === 'string') {
   
    if (executed==='true'){
      execute=true;
    }else{
      execute=false;
    }
     
  }
  if (typeof transactionId === 'string') {
    transaction = parseInt(transactionId);
  }
  return {
    enodeHigh,
    enodeLow,
    ip,
    port,
    identifier,
    nodeType: type,
    geoHash,
    organization,
    name,
    did,
    group,
    executed:execute,
    transactionId:transaction
  };
};
// export const identifierToEnodeId = (identifier: string) => {
//   if (identifier) {
//     const [enodeId] = identifier.split('_');
//     return `${enodeId}`;
//   }
//   return '';
// };
//identifierToEnodeHighAndLow
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

// export const isEqual = (node1: Enode, node2: Enode) => {
//   return (
//     node1.enodeId.toLowerCase() === node2.enodeId.toLowerCase() &&
//     node1.host === node2.host &&
//     node1.port === node2.port
//   );
// };
//modify comparate enode
export const isEqual = (node1: Enode, node2: Enode) => {
  return (
    node1.enodeHigh.toLowerCase() === node2.enodeHigh.toLowerCase() &&
    node1.enodeLow.toLowerCase() === node2.enodeLow.toLowerCase() &&
    node1.ip === node2.ip &&
    node1.port === node2.port
  );
};
