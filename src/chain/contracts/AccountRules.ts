import { Contract } from 'ethers';
import AccountRulesAbi from '../abis/AccountRules.json';
import { AccountIngress } from '../@types/AccountIngress';
import { AccountRules } from '../@types/AccountRules';

let instance: AccountRules | null = null;

export const accountRulesFactory = async (ingressInstance: AccountIngress) => {
  if (instance) return instance;

  const ruleContractName = await ingressInstance.functions.RULES_CONTRACT();
  const accountRulesAddress = await ingressInstance.functions.getContractAddress(ruleContractName);

  instance = new Contract(accountRulesAddress, AccountRulesAbi.abi, ingressInstance.provider) as AccountRules;
  return instance;
};
