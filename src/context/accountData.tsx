import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { AccountRules } from '../chain/@types/AccountRules';
import { accountRulesFactory } from '../chain/contracts/AccountRules';
import { useNetwork } from './network';

type Account = { address: string };

type ContextType =
  | {
      accountWhitelist: Account[];
      setAccountWhitelist: React.Dispatch<React.SetStateAction<Account[]>>;
      accountReadOnly?: boolean;
      setAccountReadOnly: React.Dispatch<React.SetStateAction<boolean | undefined>>;
      accountRulesContract?: AccountRules;
      setAccountRulesContract: React.Dispatch<React.SetStateAction<AccountRules | undefined>>;
    }
  | undefined;

const AccountDataContext = createContext<ContextType>(undefined);

/**
 * Provider for the data context that contains the account whitelist
 * @param {Object} props Props given to the AccountDataProvider
 * @return The provider with the following value:
 *  - accountWhitelist: list of whiteliist accounts from Account Rules contract
 *  - setNodeWhitelist: setter for the whitelist state
 */
export const AccountDataProvider: React.FC = (props: React.Props<{}>) => {
  const [accountWhitelist, setAccountWhitelist] = useState<Account[]>([]);
  const [accountReadOnly, setAccountReadOnly] = useState<boolean | undefined>(undefined);
  const [accountRulesContract, setAccountRulesContract] = useState<AccountRules | undefined>(undefined);

  const value = useMemo(
    () => ({
      accountWhitelist,
      setAccountWhitelist,
      accountReadOnly,
      setAccountReadOnly,
      accountRulesContract,
      setAccountRulesContract
    }),
    [
      accountWhitelist,
      setAccountWhitelist,
      accountReadOnly,
      setAccountReadOnly,
      accountRulesContract,
      setAccountRulesContract
    ]
  );

  const { accountIngressContract } = useNetwork();

  useEffect(() => {
    if (accountIngressContract === undefined) {
      setAccountRulesContract(undefined);
    } else {
      accountRulesFactory(accountIngressContract).then(contract => setAccountRulesContract(contract));
    }
  }, [accountIngressContract]);

  return <AccountDataContext.Provider value={value} {...props} />;
};

/**
 * Fetch the appropriate account data on chain and synchronize with it
 * @return {Object} Contains data of interest:
 *  - dataReady: true if isReadOnly and account whitelist are correctly fetched,
 *  false otherwise
 *  - userAddress: Address of the user
 *  - isReadOnly: Account contract is lock or unlock,
 *  - whitelist: list of whitelist accounts from Account contract,
 */
export const useAccountData = () => {
  const context = useContext(AccountDataContext);

  if (!context) {
    throw new Error('useAccountData must be used within an AccountDataProvider.');
  }

  const { accountWhitelist, setAccountWhitelist, accountReadOnly, setAccountReadOnly, accountRulesContract } = context;

  useEffect(() => {
    if (accountRulesContract === undefined) {
      setAccountWhitelist([]);
      setAccountReadOnly(undefined);
    } else {
      accountRulesContract.functions.isReadOnly().then(isReadOnly => setAccountReadOnly(isReadOnly));
      accountRulesContract.functions.getSize().then(whitelistSize => {
        const whitelistElementsPromises = [];
        for (let i = 0; whitelistSize.gt(i); i++) {
          whitelistElementsPromises.push(accountRulesContract.functions.getByIndex(i));
        }
        Promise.all(whitelistElementsPromises).then(responses => {
          setAccountWhitelist(responses.map(address => ({ address })));
        });
      });
    }
  }, [accountRulesContract, setAccountWhitelist, setAccountReadOnly]);

  const formattedAccountWhitelist = useMemo(() => {
    return accountWhitelist
      .map(account => ({
        ...account,
        identifier: account.address.toLowerCase(),
        status: 'active'
      }))
      .reverse();
  }, [accountWhitelist]);

  const dataReady = useMemo(() => {
    return accountRulesContract !== undefined && accountReadOnly !== undefined && accountWhitelist !== undefined;
  }, [accountRulesContract, accountReadOnly, accountWhitelist]);

  return {
    dataReady,
    whitelist: formattedAccountWhitelist,
    isReadOnly: accountReadOnly,
    accountRulesContract
  };
};
