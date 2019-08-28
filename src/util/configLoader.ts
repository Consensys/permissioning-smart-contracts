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
    // ganache vs pantheon
    // if env variables exists, then we will assume we are connecting to pantheon, otherwise we will assume ganache
    let accountIngressAddress = process.env.REACT_APP_ACCOUNT_INGRESS_CONTRACT_ADDRESS;
    let nodeIngressAddress = process.env.REACT_APP_NODE_INGRESS_CONTRACT_ADDRESS;
    let networkId = process.env.REACT_APP_NETWORK_ID;

    if (accountIngressAddress) {
      console.log('Using environment variables for contract addresses and network id');
      //make sure other two are also defined
      if (!nodeIngressAddress) {
        throw new Error('Node Ingress Address environment variable is missing');
      }

      if (!networkId) {
        throw new Error('Network Id environment variable is missing');
      }

      return { accountIngressAddress, nodeIngressAddress, networkId };
    }

    console.log('Using truffle (develop) defaults');
    // We're cheating here by knowing what truffle will write when it's running a ganache server.
    // We're forcing the types because we know what the network entry in the json file will look like so long as it's there.
    const accountIngressNetworks = Object.values(AccountIngress.networks);
    if (accountIngressNetworks.length === 0) {
      throw new Error("Account Ingress Contract abi doesn't contain any networks, probably not deployed");
    }
    accountIngressAddress = (accountIngressNetworks[0] as { address: string }).address;

    const nodeIngressNetworks = Object.values(NodeIngress.networks);
    if (nodeIngressNetworks.length === 0) {
      throw new Error("Node Ingress Contract abi doesn't contain any networks, probably not deployed");
    }
    nodeIngressAddress = (nodeIngressNetworks[0] as { address: string }).address;

    // if we haven't errored by this point then we're being driven by env and until we do it better we should accept any network
    const nodeIngressNetworkId = Object.keys(NodeIngress.networks)[0]
      ? (Object.keys(NodeIngress.networks)[0] as string)
      : 'any';

    return { accountIngressAddress, nodeIngressAddress, networkId: nodeIngressNetworkId };
  }
};

export const configPromise = loadConfig();
