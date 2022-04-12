import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { AccountRules } from '../chain/@types/AccountRules';
import { accountRulesFactory } from '../chain/contracts/AccountRules';



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
    }
  | undefined;

const AccountDataContext = createContext<ContextType>(undefined);

const loadAccountData = (
  accountRulesContract: AccountRules | undefined,
  setAccountList: (account: Account[]) => void,
  setAccountTransactionList: (account: AccountTransaction[]) => void,
  setAccountReadOnly: (readOnly?: boolean) => void
) => {
  if (accountRulesContract === undefined ) {
    setAccountList([]);
    setAccountTransactionList([]);
    setAccountReadOnly(undefined);
  } else {
    accountRulesContract.functions.isReadOnly().then(isReadOnly => setAccountReadOnly(isReadOnly));
  
    accountRulesContract.functions.getSizeTargets().then(listSize => {
      const listElementsPromises = [];
      for (let i = 0; listSize.gt(i); i++) {
        listElementsPromises.push(accountRulesContract.functions.getTargetByIndex(i));
      }
      Promise.all(listElementsPromises).then(responses => {
          // responses.map( address =>{ 
          //   console.log(address)
          // });
        setAccountList(responses.map(address => ({ address })));
      });
    });
 
    //===========
    accountRulesContract.functions.getTransactionCount(true,false).then(countTransaction =>{
      
      accountRulesContract.functions.getTransactionIds(0,countTransaction,true,false).then(listTransaction=>{
        const listElementsPromisesTransaction = [];
         for (let i = 0; i< listTransaction.length; i++) {
          listElementsPromisesTransaction.push(accountRulesContract.functions.getTransaction(listTransaction[i]));
        }
     
        Promise.all(listElementsPromisesTransaction).then(responses => {
          const responseF= responses.filter(transaction => transaction[1]=== false );
          setAccountTransactionList(responseF.map(transaction => ({address:transaction[0],isAccount:transaction[1],executed:transaction[2],transactionId: transaction[3].toNumber() })));
          
        });
      });
     
    });
    //===========
  }
};

/**
 * Provider for the data context that contains the account list
 * @param {Object} props Props given to the TargetDataProvider
 * @return The provider with the following value:
 *  - accountList: list of permitted accounts from Account Rules contract
 *  - setAccountList: setter for the allowlist state
 */
export const TargetDataProvider: React.FC<{}> = props => {
  

  const [accountList, setAccountList] = useState<Account[]>([]);
  const [accountTransactionList, setAccountTransactionList] = useState<AccountTransaction[]>([]);
  const [accountReadOnly, setAccountReadOnly] = useState<boolean | undefined>(undefined);
  const [accountRulesContract, setAccountRulesContract] = useState<AccountRules | undefined>(undefined);

  const value = useMemo(
    () => ({
      accountList: accountList,
      setAccountList: setAccountList,
      accountTransactionList: accountTransactionList,
      setAccountTransactionList: setAccountTransactionList,
      accountReadOnly,
      setAccountReadOnly,
      accountRulesContract,
      setAccountRulesContract
    }),
    [accountList, setAccountList,accountTransactionList,setAccountTransactionList,  accountReadOnly, setAccountReadOnly, accountRulesContract,setAccountRulesContract]
  );
  
  const { accountIngressContract } = useNetwork();

  useEffect(() => {
   
    if (accountIngressContract === undefined ) {
      setAccountRulesContract(undefined);
    } else {
      accountRulesFactory(accountIngressContract).then(contract => {
        setAccountRulesContract(contract);
       
          

          contract.removeAllListeners('TargetAdded');
          contract.removeAllListeners('TargetRemoved');
          contract.removeAllListeners('Confirmation');
          contract.removeAllListeners('Revocation')
          
          contract.on('TargetAdded', (success, account, event) => {
            if (success) {
              loadAccountData(contract,setAccountList,setAccountTransactionList, setAccountReadOnly);
            }
          });
          contract.on('TargetRemoved', (success, account, event) => {
            if (success) {
              loadAccountData(contract,setAccountList,setAccountTransactionList, setAccountReadOnly);
            }
          });
          contract.on('Confirmation', (success, account, event) => {
            if (success) {
              loadAccountData(contract,setAccountList,setAccountTransactionList, setAccountReadOnly);
            }
          });
          contract.on('Revocation', (success, account, event) => {
            if (success) {
              loadAccountData(contract,setAccountList,setAccountTransactionList, setAccountReadOnly);
            }
          });


        

        
        

      });
    }
  }, [accountIngressContract, setAccountList,setAccountTransactionList, setAccountReadOnly]);

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
export const useTargetData = () => {
  const context = useContext(AccountDataContext);

  if (!context) {
    throw new Error('useTargetData must be used within an TargetDataProvider.');
  }

  const { accountList, accountTransactionList,setAccountList,setAccountTransactionList, accountReadOnly, setAccountReadOnly, accountRulesContract } = context;

  useEffect(() => {
    loadAccountData(accountRulesContract,setAccountList,setAccountTransactionList, setAccountReadOnly);
  }, [accountRulesContract, setAccountList,setAccountTransactionList, setAccountReadOnly]);

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
    return accountRulesContract !== undefined  && accountReadOnly !== undefined && accountList !== undefined && accountTransactionList !== undefined;
  }, [accountRulesContract, accountReadOnly, accountList, accountTransactionList]);

  return {
    dataReady,
    allowlist: formattedAccountList,
    allowTransactionlist: formattedAccountTransactionList,
    isReadOnly: accountReadOnly,
    accountRulesContract
  };
};
