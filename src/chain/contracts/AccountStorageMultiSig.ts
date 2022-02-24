import { Contract } from 'ethers';
import AccountStorageMultiSigAbi from '../abis/AccountStorageMultiSig.json';
import { AccountRules } from '../@types/AccountRules';
import { AccountStorageMultiSig } from '../@types/AccountStorageMultiSig';

let instance: AccountStorageMultiSig | null = null;

export const accountStorageMultiSigFactory = async (accountRulesInstance: AccountRules) => {
  if (instance) return instance;


  const accountStorageMultiSigAddress = await accountRulesInstance.functions.getStorage();

  instance = new Contract(accountStorageMultiSigAddress, AccountStorageMultiSigAbi.abi, accountRulesInstance.signer) as AccountStorageMultiSig;
  return instance;
};
