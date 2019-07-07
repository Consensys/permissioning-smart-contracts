import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { drizzleReactHooks } from 'drizzle-react';

type Account = { address: string };

type ContextType =
  | {
      accountWhitelist: Account[];
      setAccountWhitelist: (account: Account[]) => void;
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
  const value = useMemo(() => ({ accountWhitelist, setAccountWhitelist }), [accountWhitelist, setAccountWhitelist]);
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

  const { accountWhitelist, setAccountWhitelist } = context;
  const { drizzle, useCacheCall } = drizzleReactHooks.useDrizzle();
  const accountIsReadOnly: boolean = useCacheCall('AccountRules', 'isReadOnly');
  const accountWhitelistSize: number = useCacheCall('AccountRules', 'getSize');
  const { getByIndex: getAccountByIndex } = drizzle.contracts.AccountRules.methods;
  const { userAddress } = drizzleReactHooks.useDrizzleState((drizzleState: any) => ({
    userAddress: drizzleState.accounts[0]
  }));

  useEffect(() => {
    const promises = [];
    for (let index = 0; index < accountWhitelistSize; index++) {
      promises.push(getAccountByIndex(index).call());
    }
    Promise.all(promises).then(responses => {
      const updatedAccountWhitelist = responses.map((address: string) => ({ address }));
      setAccountWhitelist(updatedAccountWhitelist);
    });
  }, [accountWhitelistSize, setAccountWhitelist, getAccountByIndex]);

  const dataReady = useMemo(() => typeof accountIsReadOnly === 'boolean' && Array.isArray(accountWhitelist), [
    accountIsReadOnly,
    accountWhitelist
  ]);

  const formattedAccountWhitelist = useMemo(() => {
    return accountWhitelist
      .map(account => ({
        ...account,
        identifier: account.address.toLowerCase(),
        status: 'active'
      }))
      .reverse();
  }, [accountWhitelist]);

  return {
    userAddress,
    dataReady,
    whitelist: formattedAccountWhitelist,
    isReadOnly: accountIsReadOnly
  };
};
