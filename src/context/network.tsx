// Libs
import React, { useContext, useEffect, useState, createContext, useMemo } from 'react';
import { Drizzle, generateStore } from 'drizzle';
import { drizzleReactHooks } from 'drizzle-react';
// Constants
import drizzleOptions from '../drizzleOptions';
import NodeRules from '../chain/abis/NodeRules.json';
import AccountRules from '../chain/abis/AccountRules.json';
import Admin from '../chain/abis/Admin.json';
// Utils
import { getAllowedNetworks } from '../util/contracts';
import { useConfig } from '../context/configData';

import { providerFactory } from '../chain/provider';
import { AccountIngress } from '../chain/@types/AccountIngress';
import { accountIngressFactory } from '../chain/contracts/AccountIngress';
import { NodeIngress } from '../chain/@types/NodeIngress';
import { nodeIngressFactory } from '../chain/contracts/NodeIngress';

type ContextType =
  | {
      isCorrectNetwork?: boolean;
      setIsCorrectNetwork: React.Dispatch<React.SetStateAction<boolean | undefined>>;
      web3Initialized: boolean;
      setWeb3Initialized: React.Dispatch<React.SetStateAction<boolean>>;
      contracts: {
        accountIngressContract?: AccountIngress;
        setAccountIngressContract: React.Dispatch<React.SetStateAction<AccountIngress | undefined>>;
        nodeIngressContract?: NodeIngress;
        setNodeIngressContract: React.Dispatch<React.SetStateAction<NodeIngress | undefined>>;
      };
    }
  | undefined;

const NetworkContext = createContext<ContextType>(undefined);

/**
 * Provider for the network context that contains informations about the
 * blockchain provider
 * @param {Object} props Props given to the NetworkProvider
 * @return The provider with the following value:
 *  - isCorrectNetwork: true if the detected network is one of the allowed
 *  networks by the contracts, false if it is not, null if there is no detected
 *  network
 *  - setIsCorrectNetwork: setter of isCorrectNetwork
 *  - web3Initialized: true if Drizzle has initialized web3, false otherwise
 *  - setWeb3Initialized: setter for web3Initialized
 */
export const NetworkProvider: React.FC<{}> = props => {
  const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean | undefined>(undefined);
  const [web3Initialized, setWeb3Initialized] = useState<boolean>(false);
  const [accountIngressContract, setAccountIngressContract] = useState<AccountIngress | undefined>(undefined);
  const [nodeIngressContract, setNodeIngressContract] = useState<NodeIngress | undefined>(undefined);

  const config = useConfig();
  const [drizzle] = useState<Drizzle>(() => {
    const options = drizzleOptions(config);

    const drizzleStore = generateStore(options);
    return new Drizzle(options, drizzleStore);
  });

  useEffect(() => {
    providerFactory().then(provider => {
      accountIngressFactory(config, provider).then(accountIngress => setAccountIngressContract(accountIngress));
      nodeIngressFactory(config, provider).then(nodeIngress => setNodeIngressContract(nodeIngress));
    });
  }, [config]);

  const value = useMemo(
    () => ({
      isCorrectNetwork,
      setIsCorrectNetwork,
      web3Initialized,
      setWeb3Initialized,
      contracts: {
        accountIngressContract,
        setAccountIngressContract,
        nodeIngressContract,
        setNodeIngressContract
      }
    }),
    [
      isCorrectNetwork,
      setIsCorrectNetwork,
      web3Initialized,
      setWeb3Initialized,
      accountIngressContract,
      setAccountIngressContract,
      nodeIngressContract,
      setNodeIngressContract
    ]
  );

  return (
    <drizzleReactHooks.DrizzleProvider drizzle={drizzle}>
      <NetworkContext.Provider value={value} {...props} />
    </drizzleReactHooks.DrizzleProvider>
  );
};

/**
 * Synchronize with the blockchain network
 * @return {Object} The network informations:
 *  - isCorrectNetwork: true if the detected network is one of the allowed
 *  networks by the contracts, false if it is not, null if there is no detected
 *  network,
 *  - networkId: The id of the network,
 *  - web3Initialized: true if Drizzle has initialized web3, false otherwise
 */
export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a DataProvider.');
  }

  const { isCorrectNetwork, setIsCorrectNetwork, web3Initialized, setWeb3Initialized, contracts } = context;

  const { networkId, status } = drizzleReactHooks.useDrizzleState((drizzleState: any) => ({
    status: drizzleState.web3.status,
    networkId: drizzleState.web3.networkId
  }));

  useEffect(() => {
    if (status === 'initialized') {
      const allowedNetworks = getAllowedNetworks([AccountRules, NodeRules, Admin]);
      if (networkId) {
        const isCorrectNetwork = allowedNetworks.includes(networkId);
        setIsCorrectNetwork(isCorrectNetwork);
      }
      setWeb3Initialized(true);
    }
  }, [networkId, setIsCorrectNetwork, status, setWeb3Initialized]);

  return {
    isCorrectNetwork,
    networkId,
    web3Initialized,
    accountIngressContract: contracts.accountIngressContract,
    nodeIngressContract: contracts.nodeIngressContract
  };
};
