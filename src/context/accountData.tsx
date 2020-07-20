import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { AccountRules } from '../chain/@types/AccountRules';
import { accountRulesFactory } from '../chain/contracts/AccountRules';
import { useNetwork } from './network';

type Account = { address: string };

type ContextType =
  | {
      accountList: Account[];
      setAccountList: React.Dispatch<React.SetStateAction<Account[]>>;
      accountReadOnly?: boolean;
      setAccountReadOnly: React.Dispatch<React.SetStateAction<boolean | undefined>>;
      accountRulesContract?: AccountRules;
      setAccountRulesContract: React.Dispatch<React.SetStateAction<AccountRules | undefined>>;
    }
  | undefined;

const AccountDataContext = createContext<ContextType>(undefined);

const loadAccountData = (
  accountRulesContract: AccountRules | undefined,
  setAccountList: (account: Account[]) => void,
  setAccountReadOnly: (readOnly?: boolean) => void
) => {
  if (accountRulesContract === undefined) {
    setAccountList([]);
    setAccountReadOnly(undefined);
  } else {
    accountRulesContract.functions.isReadOnly().then(isReadOnly => setAccountReadOnly(isReadOnly));
    accountRulesContract.functions.getSize().then(listSize => {
      const listElementsPromises = [];
      for (let i = 0; listSize.gt(i); i++) {
        listElementsPromises.push(accountRulesContract.functions.getByIndex(i));
      }
      Promise.all(listElementsPromises).then(responses => {
        setAccountList(responses.map(address => ({ address })));
      });
    });
  }
};

/**
 * Provider for the data context that contains the account list
 * @param {Object} props Props given to the AccountDataProvider
 * @return The provider with the following value:
 *  - accountList: list of permitted accounts from Account Rules contract
 *  - setAccountList: setter for the allowlist state
 */
export const AccountDataProvider: React.FC<{}> = props => {
  const [accountList, setAccountList] = useState<Account[]>([]);
  const [accountReadOnly, setAccountReadOnly] = useState<boolean | undefined>(undefined);
  const [accountRulesContract, setAccountRulesContract] = useState<AccountRules | undefined>(undefined);

  const value = useMemo(
    () => ({
      accountList: accountList,
      setAccountList: setAccountList,
      accountReadOnly,
      setAccountReadOnly,
      accountRulesContract,
      setAccountRulesContract
    }),
    [accountList, setAccountList, accountReadOnly, setAccountReadOnly, accountRulesContract, setAccountRulesContract]
  );

  const { accountIngressContract } = useNetwork();

  useEffect(() => {
    if (accountIngressContract === undefined) {
      setAccountRulesContract(undefined);
    } else {
      accountRulesFactory(accountIngressContract).then(contract => {
        setAccountRulesContract(contract);
        contract.removeAllListeners('AccountAdded');
        contract.removeAllListeners('AccountRemoved');
        contract.on('AccountAdded', (success, account, event) => {
          if (success) {
            loadAccountData(contract, setAccountList, setAccountReadOnly);
          }
        });
        contract.on('AccountRemoved', (success, account, event) => {
          if (success) {
            loadAccountData(contract, setAccountList, setAccountReadOnly);
          }
        });
      });
    }
  }, [accountIngressContract, setAccountList, setAccountReadOnly]);

  return <AccountDataContext.Provider value={value} {...props} />;
};

/**
 * Fetch the appropriate account data on chain and synchronize with it
 * @return {Object} Contains data of interest:
 *  - dataReady: true if isReadOnly and account allowlist are correctly fetched,
 *  false otherwise
 *  - userAddress: Address of the user
 *  - isReadOnly: Account contract is lock or unlock,
 *  - allowlist: list of permitted accounts from Account contract,
 */
export const useAccountData = () => {
  const context = useContext(AccountDataContext);

  if (!context) {
    throw new Error('useAccountData must be used within an AccountDataProvider.');
  }

  const { accountList, setAccountList, accountReadOnly, setAccountReadOnly, accountRulesContract } = context;

  useEffect(() => {
    loadAccountData(accountRulesContract, setAccountList, setAccountReadOnly);
  }, [accountRulesContract, setAccountList, setAccountReadOnly]);

  const formattedAccountList = useMemo(() => {
    return accountList
      .map(account => ({
        ...account,
        identifier: account.address.toLowerCase(),
        status: 'active'
      }))
      .reverse();
  }, [accountList]);

  const dataReady = useMemo(() => {
    return accountRulesContract !== undefined && accountReadOnly !== undefined && accountList !== undefined;
  }, [accountRulesContract, accountReadOnly, accountList]);

  return {
    dataReady,
    allowlist: formattedAccountList,
    isReadOnly: accountReadOnly,
    accountRulesContract
  };
};
