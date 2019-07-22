// Libs
import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { Admin } from '../chain/@types/Admin';
import { adminFactory } from '../chain/contracts/Admin';
import { useNetwork } from './network';

type ContextType =
  | {
      admins?: string[];
      setAdmins: (admins: string[] | undefined) => void;
      adminContract?: Admin;
      setAdminContract: React.Dispatch<React.SetStateAction<Admin | undefined>>;
      userAddress?: string;
      setUserAddress: React.Dispatch<React.SetStateAction<string | undefined>>;
    }
  | undefined;

const AdminDataContext = createContext<ContextType>(undefined);

const loadAdminData = (adminContract: Admin | undefined, setAdmins: (admins: string[] | undefined) => void) => {
  if (adminContract === undefined) {
    setAdmins(undefined);
  } else {
    adminContract.functions.getAdmins().then(admins => {
      setAdmins(admins);
    });
  }
};

/**
 * Provider for the data context that contains the Admin whitelist
 * @param {Object} props Props given to the AdminDataProvider
 * @return The provider with the following value:
 *  - admins: list of Admin accounts from Admin Rules contract
 *  - setAdmins: setter for the Admin list state
 */
export const AdminDataProvider: React.FC = (props: React.Props<{}>) => {
  const [admins, setAdmins] = useState<string[] | undefined>(undefined);
  const [adminContract, setAdminContract] = useState<Admin | undefined>(undefined);
  const [userAddress, setUserAddress] = useState<string | undefined>(undefined);

  const value = useMemo(() => ({ admins, setAdmins, adminContract, setAdminContract, userAddress, setUserAddress }), [
    admins,
    setAdmins,
    adminContract,
    setAdminContract,
    userAddress,
    setUserAddress
  ]);

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
          if (success) loadAdminData(contract, setAdmins);
        });
        contract.on('AdminRemoved', (success, account, event) => {
          if (success) loadAdminData(contract, setAdmins);
        });
      });
      ingressContract.signer.getAddress().then(setUserAddress);
    }
  }, [accountIngressContract, nodeIngressContract, setAdmins, setUserAddress]);

  return <AdminDataContext.Provider value={value} {...props} />;
};

/**
 * Fetch the appropriate Admin data on chain and synchronize with it
 * @return {Object} Contains data of interest:
 *  - dataReady: true if Admin whitelist has been correctly fetched,
 *  false otherwise
 *  - userAddress: Address of the user
 *  - isAdmin: user in an Admin,
 *  - whitelist: list of whitelist nodes from Node contract,
 */
export const useAdminData = () => {
  const context = useContext(AdminDataContext);

  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider.');
  }

  const { admins, setAdmins, adminContract, userAddress } = context;

  useEffect(() => {
    loadAdminData(adminContract, setAdmins);
  }, [adminContract, setAdmins]);

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

  const dataReady = useMemo(() => adminContract !== undefined && admins !== undefined && userAddress !== undefined, [
    adminContract,
    admins,
    userAddress
  ]);

  const isAdmin = useMemo(() => (dataReady && admins ? admins.includes(userAddress!) : false), [
    dataReady,
    admins,
    userAddress
  ]);

  return {
    dataReady,
    userAddress,
    isAdmin,
    admins: formattedAdmins,
    adminContract
  };
};
