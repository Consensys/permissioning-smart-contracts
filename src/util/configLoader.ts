import AccountIngress from '../chain/abis/AccountIngress.json';
import NodeIngress from '../chain/abis/NodeIngress.json';

export type Config = {
  accountIngressAddress: string;
  nodeIngressAddress: string;
  networkId: string;
};

const loadConfig = async (): Promise<Config> => {
  // production loader
  if (process.env.NODE_ENV === 'production') {
    const response = await fetch('config.json');

    if (response.ok) {
      return response.json().catch((reason: any) => {
        console.log('config parsing failed with error:', reason);
        throw new Error('Config parsing failed with error: ' + reason);
      });
    } else {
      console.log('Failed to load config file');
      throw new Error('Config file not found');
    }
    // development defaults
  } else {
    // We're cheating here by knowing what truffle will write when it's running a ganache server.
    // We're forcing the types because we know what the network entry in the json file will look like so long as it's there.
    const accountIngressNetworks = Object.values(AccountIngress.networks);
    if (accountIngressNetworks.length === 0) {
      throw new Error("Account Ingress Contract abi doesn't contain any networks, probably not deployed");
    }
    const accountIngressAddress = (accountIngressNetworks[0] as { address: string }).address;

    const nodeIngressNetworks = Object.values(NodeIngress.networks);
    if (nodeIngressNetworks.length === 0) {
      throw new Error("Node Ingress Contract abi doesn't contain any networks, probably not deployed");
    }
    const nodeIngressAddress = (nodeIngressNetworks[0] as { address: string }).address;

    const nodeIngressNetworkId = Object.keys(NodeIngress.networks)[0] as string;

    return { accountIngressAddress, nodeIngressAddress, networkId: nodeIngressNetworkId };
  }
};

export const configPromise = loadConfig();
