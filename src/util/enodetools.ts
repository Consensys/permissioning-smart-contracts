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
        enodeId = node.username;
      }
      ip = node.hostname;
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
    const [enodeId] = identifier.split('_');
    return `${enodeId}`;
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
