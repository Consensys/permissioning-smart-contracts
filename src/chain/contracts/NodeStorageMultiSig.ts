import { Contract, Signer } from 'ethers';
import NodeStorageMultiSigAbi from '../abis/NodeStorageMultiSig.json';
import {NodeRules } from '../@types/NodeRules';
import { NodeStorageMultiSig } from '../@types/NodeStorageMultiSig';


let instance: NodeStorageMultiSig | null = null;

export const nodeStorageMultiSigFactory = async (nodeRulesInstance: NodeRules ) => {
  if (instance) return instance;

  const nodeStorageMultiSigAddress = await nodeRulesInstance.functions.getStorage();
  instance = new Contract(nodeStorageMultiSigAddress, NodeStorageMultiSigAbi.abi, nodeRulesInstance.signer) as NodeStorageMultiSig;
  return instance;
};
