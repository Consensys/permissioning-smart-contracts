import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { AccountRules } from '../chain/@types/AccountRules';
import { AccountStorageMultiSig } from '../chain/@types/AccountStorageMultiSig';
import { accountRulesFactory } from '../chain/contracts/AccountRules';
import { accountStorageMultiSigFactory } from '../chain/contracts/AccountStorageMultiSig';


import { useNetwork } from './network';

type Account = { address: string};
type AccountTransaction = { address: string , isAccount:boolean,executed:boolean , transactionId:number};
type ContextType =
  | {
      accountList: Account[];
      accountTransactionList: AccountTransaction[];
      setAccountList: React.Dispatch<React.SetStateAction<Account[]>>;
      setAccountTransactionList: React.Dispatch<React.SetStateAction<AccountTransaction[]>>;
      accountReadOnly?: boolean;
      setAccountReadOnly: React.Dispatch<React.SetStateAction<boolean | undefined>>;
      accountRulesContract?: AccountRules;
      setAccountRulesContract: React.Dispatch<React.SetStateAction<AccountRules | undefined>>;
      accountStorageMultiSigContract?:AccountStorageMultiSig;
      setAccountStorageMultiSigContract: React.Dispatch<React.SetStateAction<AccountStorageMultiSig | undefined>>;
    }
  | undefined;

const AccountDataContext = createContext<ContextType>(undefined);

const loadAccountData = (
  accountRulesContract: AccountRules | undefined,
  accountStorageMultiSigContract: AccountStorageMultiSig | undefined,
  setAccountList: (account: Account[]) => void,
  setAccountTransactionList: (account: AccountTransaction[]) => void,
  setAccountReadOnly: (readOnly?: boolean) => void
) => {
  if (accountRulesContract === undefined || accountStorageMultiSigContract === undefined) {
    setAccountList([]);
    setAccountTransactionList([]);
    setAccountReadOnly(undefined);
  } else {
    accountRulesContract.functions.isReadOnly().then(isReadOnly => setAccountReadOnly(isReadOnly));
  
    accountRulesContract.functions.getSizeAccounts().then(listSize => {
      const listElementsPromises = [];
      for (let i = 0; listSize.gt(i); i++) {
        listElementsPromises.push(accountRulesContract.functions.getByIndex(i));
      }
      Promise.all(listElementsPromises).then(responses => {
          // responses.map( address =>{ 
          //   console.log(address)
          // });
        setAccountList(responses.map(address => ({ address })));
      });
    });
 
    //===========
    accountStorageMultiSigContract.functions.getTransactionCount(true,false).then(countTransaction =>{
      
      accountStorageMultiSigContract.functions.getTransactionIds(0,countTransaction,true,false).then(listTransaction=>{
        const listElementsPromisesTransaction = [];
         for (let i = 0; i< listTransaction.length; i++) {
          listElementsPromisesTransaction.push(accountStorageMultiSigContract.functions.getTransaction(listTransaction[i]));
        }
     
        Promise.all(listElementsPromisesTransaction).then(responses => {
          const responseF= responses.filter(transaction => transaction[1] );
          setAccountTransactionList(responseF.map(transaction => ({address:transaction[0],isAccount:transaction[1],executed:transaction[2],transactionId: transaction[3].toNumber() })));
          
        });
      });
     
    });
    //===========
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
  const [accountTransactionList, setAccountTransactionList] = useState<AccountTransaction[]>([]);
  const [accountReadOnly, setAccountReadOnly] = useState<boolean | undefined>(undefined);
  const [accountRulesContract, setAccountRulesContract] = useState<AccountRules | undefined>(undefined);
  const [ accountStorageMultiSigContract,setAccountStorageMultiSigContract] = useState<AccountStorageMultiSig | undefined>(undefined);
  const value = useMemo(
    () => ({
      accountList: accountList,
      setAccountList: setAccountList,
      accountTransactionList: accountTransactionList,
      setAccountTransactionList: setAccountTransactionList,
      accountReadOnly,
      setAccountReadOnly,
      accountRulesContract,
      setAccountRulesContract,
      accountStorageMultiSigContract,
      setAccountStorageMultiSigContract
    }),
    [accountList, setAccountList,accountTransactionList,setAccountTransactionList,  accountReadOnly, setAccountReadOnly, accountRulesContract,setAccountRulesContract,accountStorageMultiSigContract,setAccountStorageMultiSigContract]
  );
  
  const { accountIngressContract } = useNetwork();

  useEffect(() => {
   
    if (accountIngressContract === undefined ) {
      setAccountRulesContract(undefined);
    } else {
      accountRulesFactory(accountIngressContract).then(contract => {
        setAccountRulesContract(contract);
        accountStorageMultiSigFactory(contract).then(storageContract => { 
          setAccountStorageMultiSigContract(storageContract);

          contract.removeAllListeners('AccountAdded');
          contract.removeAllListeners('AccountRemoved');
          storageContract.removeAllListeners('Confirmation');
          storageContract.removeAllListeners('Revocation')
          contract.on('AccountAdded', (success, account, event) => {
            if (success) {
              loadAccountData(contract, accountStorageMultiSigContract,setAccountList,setAccountTransactionList, setAccountReadOnly);
            }
          });
          contract.on('AccountRemoved', (success, account, event) => {
            if (success) {
              loadAccountData(contract, accountStorageMultiSigContract,setAccountList,setAccountTransactionList, setAccountReadOnly);
            }
          });
          storageContract.on('Confirmation', (success, account, event) => {
            if (success) {
              loadAccountData(contract, accountStorageMultiSigContract,setAccountList,setAccountTransactionList, setAccountReadOnly);
            }
          });
          storageContract.on('Revocation', (success, account, event) => {
            if (success) {
              loadAccountData(contract, accountStorageMultiSigContract,setAccountList,setAccountTransactionList, setAccountReadOnly);
            }
          });
        });
        

        
        

      });
    }
  }, [accountIngressContract,accountStorageMultiSigContract, setAccountList,setAccountTransactionList, setAccountReadOnly]);

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

  const { accountList, accountTransactionList,setAccountList,setAccountTransactionList, accountReadOnly, setAccountReadOnly, accountRulesContract , accountStorageMultiSigContract} = context;

  useEffect(() => {
    loadAccountData(accountRulesContract, accountStorageMultiSigContract,setAccountList,setAccountTransactionList, setAccountReadOnly);
  }, [accountRulesContract,accountStorageMultiSigContract, setAccountList,setAccountTransactionList, setAccountReadOnly]);

  const formattedAccountList = useMemo(() => {
    return accountList
      .map(account => ({
        ...account,
        identifier: account.address.toLowerCase(),
        status: 'active'
      }))
      .reverse();
  }, [accountList]);

  const formattedAccountTransactionList = useMemo(() => {
    return accountTransactionList
      .map(account => ({
        ...account,
        identifier: account.address.toLowerCase(),
        status: (account.executed) ? 'active' : 'pendingAddition'
      }))
      .reverse();
  }, [accountTransactionList]);

  const dataReady = useMemo(() => {
    return accountRulesContract !== undefined && accountStorageMultiSigContract!== undefined && accountReadOnly !== undefined && accountList !== undefined && accountTransactionList !== undefined;
  }, [accountRulesContract,accountStorageMultiSigContract, accountReadOnly, accountList, accountTransactionList]);

  return {
    dataReady,
    allowlist: formattedAccountList,
    allowTransactionlist: formattedAccountTransactionList,
    isReadOnly: accountReadOnly,
    accountRulesContract,
    accountStorageMultiSigContract
  };
};
