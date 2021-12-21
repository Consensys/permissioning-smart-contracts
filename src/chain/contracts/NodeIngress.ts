import { Contract, Signer } from 'ethers';
import { Provider } from 'ethers/providers';
import NodeIngressAbi from '../abis/NodeIngress.json';
import { NodeIngress } from '../@types/NodeIngress';
import { Config } from '../../util/configLoader';

let instance: NodeIngress | null = null;

export const nodeIngressFactory = async (config: Config, provider: Provider | Signer) => {
  if (instance) return instance;

  instance = new Contract(config.nodeIngressAddress, NodeIngressAbi.abi, provider) as NodeIngress;
  return instance;
};
