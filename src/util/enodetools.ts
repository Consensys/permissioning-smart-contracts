export type Enode = {
  enodeId: string;
  host: string;
  port: string;
};

export const enodeToParams = (enodeURL: string) => {
  let enodeId = '';
  let host = '';
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
      host = node.hostname;
      port = node.port;

      node.searchParams.forEach((value, name, searchParams) => {
        extraParams.set(name.toLowerCase(), value);
      });
    }
  } catch (err) {}

  return {
    enodeId,
    host,
    port,
    extraParams
  };
};

export const paramsToIdentifier = ({ enodeId, host, port }: { enodeId: string; host: string; port: string }) => {
  return `${enodeId}_${host}_${port}`;
};

export const identifierToParams = (identifier: string) => {
  const [enodeId, host, port] = identifier.split('_');
  return {
    enodeId,
    host,
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
    node1.enodeId.toLowerCase() === node2.enodeId.toLowerCase() &&
    node1.host === node2.host &&
    node1.port === node2.port
  );
};
