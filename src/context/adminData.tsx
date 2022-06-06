// Libs
import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { Admin } from '../chain/@types/Admin';
import { adminFactory } from '../chain/contracts/Admin';
import { useNetwork } from './network';
import { listenForAccountChange } from '../chain/provider';

type AdminTransaction = { address: string; executed: boolean; transactionId: number };
type ContextType =
  | {
      admins?: string[];
      setAdmins: (admins: string[] | undefined) => void;
      adminTransactionList: AdminTransaction[];
      setAdminTransactionList: React.Dispatch<React.SetStateAction<AdminTransaction[]>>;
      adminContract?: Admin;
      setAdminContract: React.Dispatch<React.SetStateAction<Admin | undefined>>;
      userAddress?: string;
      setUserAddress: React.Dispatch<React.SetStateAction<string | undefined>>;
    }
  | undefined;

const AdminDataContext = createContext<ContextType>(undefined);

const loadAdminData = (
  adminContract: Admin | undefined,
  setAdmins: (admins: string[] | undefined) => void,
  setAdminTransactionList: (account: AdminTransaction[]) => void
) => {
  if (adminContract === undefined) {
    setAdmins(undefined);
    setAdminTransactionList([]);
  } else {
    adminContract.functions.getOwners().then(admins => {
      setAdmins(admins);
    });

    adminContract.functions.getTransactionCount(true, false).then(countTransaction => {
      adminContract.functions.getTransactionIds(0, countTransaction, true, false).then(listTransaction => {
        const listElementsPromisesTransaction = [];
        for (let i = 0; i < listTransaction.length; i++) {
        //  console.log(adminContract.functions.getTransaction(listTransaction[i]));
          listElementsPromisesTransaction.push(adminContract.functions.getTransaction(listTransaction[i]));
        }

        Promise.all(listElementsPromisesTransaction).then(responses => {
          const responseF = responses.filter(transaction => transaction[1] === false);
          setAdminTransactionList(
            responseF.map(transaction => ({
              address: transaction[0],
              executed: transaction[1],
              transactionId: transaction[2].toNumber()
            }))
          );
        });
      });
    });
  }
};

/**
 * Provider for the data context that contains the Admin list
 * @param {Object} props Props given to the AdminDataProvider
 * @return The provider with the following value:
 *  - admins: list of Admin accounts from Admin Rules contract
 *  - setAdmins: setter for the Admin list state
 */
export const AdminDataProvider: React.FC = (props: React.Props<{}>) => {
  const [admins, setAdmins] = useState<string[] | undefined>(undefined);
  const [adminTransactionList, setAdminTransactionList] = useState<AdminTransaction[]>([]);
  const [adminContract, setAdminContract] = useState<Admin | undefined>(undefined);
  const [userAddress, setUserAddress] = useState<string | undefined>(undefined);

  const value = useMemo(
    () => ({
      admins,
      setAdmins,
      adminTransactionList: adminTransactionList,
      setAdminTransactionList: setAdminTransactionList,
      adminContract,
      setAdminContract,
      userAddress,
      setUserAddress
    }),
    [
      admins,
      setAdmins,
      adminTransactionList,
      setAdminTransactionList,
      adminContract,
      setAdminContract,
      userAddress,
      setUserAddress
    ]
  );

  const { accountIngressContract, nodeIngressContract } = useNetwork();

  useEffect(() => {
    const ingressContract = accountIngressContract || nodeIngressContract;
    if (ingressContract === undefined) {
      setAdminContract(undefined);
      setUserAddress(undefined);
    } else {
      adminFactory(ingressContract).then(contract => {
        setAdminContract(contract);
        contract.removeAllListeners('AdminAdded');
        contract.removeAllListeners('AdminRemoved');
        contract.on('AdminAdded', (success, account, message, event) => {
          if (success) loadAdminData(contract, setAdmins, setAdminTransactionList);
        });
        contract.on('AdminRemoved', (success, account, event) => {
          if (success) loadAdminData(contract, setAdmins, setAdminTransactionList);
        });
        contract.on('Confirmation', (success, account, event) => {
          if (success) {
            loadAdminData(contract, setAdmins, setAdminTransactionList);
          }
        });
        contract.on('Revocation', (success, account, event) => {
          if (success) {
            loadAdminData(contract, setAdmins, setAdminTransactionList);
          }
        });
      });
      ingressContract.signer.getAddress().then(setUserAddress);
    }
  }, [accountIngressContract, nodeIngressContract, setAdmins, setAdminTransactionList, setUserAddress]);

  useEffect(() => {
    listenForAccountChange(setUserAddress);
  }, [setUserAddress]);

  return <AdminDataContext.Provider value={value} {...props} />;
};

/**
 * Fetch the appropriate Admin data on chain and synchronize with it
 * @return {Object} Contains data of interest:
 *  - dataReady: true if Admin list has been correctly fetched,
 *  false otherwise
 *  - userAddress: Address of the user
 *  - isAdmin: user is an Admin,
 *  - allowlist: list of admin accounts from Admin contract,
 */
export const useAdminData = () => {
  const context = useContext(AdminDataContext);

  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider.');
  }

  const { admins, adminTransactionList, setAdmins, setAdminTransactionList, adminContract, userAddress } = context;

  useEffect(() => {
    loadAdminData(adminContract, setAdmins, setAdminTransactionList);
  }, [adminContract, setAdmins, setAdminTransactionList]);

  const formattedAdmins = useMemo(() => {
    return admins
      ? admins
          .map(address => ({
            address,
            identifier: address.toLowerCase(),
            status: 'active'
          }))
          .reverse()
      : undefined;
  }, [admins]);

  const formattedAdminTransactionList = useMemo(() => {
    return adminTransactionList
      .map(account => ({
        ...account,
        identifier: account.address.toLowerCase(),
        status: account.executed ? 'active' : 'pendingAddition'
      }))
      .reverse();
  }, [adminTransactionList]);

  const dataReady = useMemo(
    () => adminContract !== undefined && admins !== undefined && userAddress !== undefined,
    [adminContract, admins, adminTransactionList, userAddress]
  );

  const isAdmin = useMemo(
    () => (dataReady && admins ? admins.includes(userAddress!) : false),
    [dataReady, admins, userAddress]
  );

  return {
    dataReady,
    userAddress,
    isAdmin,
    admins: formattedAdmins,
    allowTransactionlist: formattedAdminTransactionList,
    adminContract
  };
};
