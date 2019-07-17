import { Contract } from 'ethers';
import NodeRulesAbi from '../abis/NodeRules.json';
import { NodeIngress } from '../@types/NodeIngress';
import { NodeRules } from '../@types/NodeRules';

let instance: NodeRules | null = null;

export const nodeRulesFactory = async (ingressInstance: NodeIngress) => {
  if (instance) return instance;

  const ruleContractName = await ingressInstance.functions.RULES_CONTRACT();
  const nodeRulesAddress = await ingressInstance.functions.getContractAddress(ruleContractName);

  instance = new Contract(nodeRulesAddress, NodeRulesAbi.abi, ingressInstance.signer) as NodeRules;
  return instance;
};
