import AccountIngress from '../chain/abis/AccountIngress.json';
import NodeIngress from '../chain/abis/NodeIngress.json';

export type Config = {
  accountIngressAddress: string;
  nodeIngressAddress: string;
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

    return { accountIngressAddress, nodeIngressAddress };
  }
};

export const configPromise = loadConfig();
