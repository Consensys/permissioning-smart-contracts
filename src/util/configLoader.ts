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
    const accountIngressNetwork = Object.values(AccountIngress.networks);
    if (accountIngressNetwork.length === 0) {
      throw new Error("Account Ingress Contract abi doesn't contain any networks, probably not deployed");
    }
    const accountIngressAddress = accountIngressNetwork[0].address;

    const nodeIngressNetwork = Object.values(NodeIngress.networks);
    if (nodeIngressNetwork.length === 0) {
      throw new Error("Node Ingress Contract abi doesn't contain any networks, probably not deployed");
    }
    const nodeIngressAddress = nodeIngressNetwork[0].address;

    return { accountIngressAddress, nodeIngressAddress };
  }
};

export const configPromise = loadConfig();
