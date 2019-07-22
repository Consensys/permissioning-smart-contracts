// Libs
import React, { useContext, useEffect, useState, createContext, useMemo } from 'react';
import { useConfig } from '../context/configData';

import { providerFactory } from '../chain/provider';
import { AccountIngress } from '../chain/@types/AccountIngress';
import { accountIngressFactory } from '../chain/contracts/AccountIngress';
import { NodeIngress } from '../chain/@types/NodeIngress';
import { nodeIngressFactory } from '../chain/contracts/NodeIngress';

type ContextType =
  | {
      networkId?: number;
      setNetworkId: React.Dispatch<React.SetStateAction<number | undefined>>;
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
 */
export const NetworkProvider: React.FC<{}> = props => {
  const [accountIngressContract, setAccountIngressContract] = useState<AccountIngress | undefined>(undefined);
  const [nodeIngressContract, setNodeIngressContract] = useState<NodeIngress | undefined>(undefined);
  const [networkId, setNetworkId] = useState<number | undefined>(undefined);

  const config = useConfig();

  useEffect(() => {
    providerFactory().then(provider => {
      accountIngressFactory(config, provider).then(accountIngress => setAccountIngressContract(accountIngress));
      nodeIngressFactory(config, provider).then(nodeIngress => setNodeIngressContract(nodeIngress));
    });
  }, [config]);

  const value = useMemo(
    () => ({
      networkId,
      setNetworkId,
      contracts: {
        accountIngressContract,
        setAccountIngressContract,
        nodeIngressContract,
        setNodeIngressContract
      }
    }),
    [
      accountIngressContract,
      setAccountIngressContract,
      nodeIngressContract,
      setNodeIngressContract,
      networkId,
      setNetworkId
    ]
  );

  return <NetworkContext.Provider value={value} {...props} />;
};

/**
 * Synchronize with the blockchain network
 * @return {Object} The network informations:
 *  - isCorrectNetwork: true if the detected network is one of the allowed
 *  networks by the contracts, false if it is not, null if there is no detected
 *  network,
 *  - networkId: The id of the network,
 */
export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a DataProvider.');
  }

  const config = useConfig();

  const { contracts, networkId, setNetworkId } = context;

  useEffect(() => {
    const ingress = contracts.accountIngressContract || contracts.nodeIngressContract;
    if (ingress === undefined) {
      setNetworkId(undefined);
    } else {
      ingress.provider.getNetwork().then(network => setNetworkId(network.chainId));
    }
  }, [contracts.accountIngressContract, contracts.nodeIngressContract, setNetworkId]);

  const isCorrectNetwork = useMemo(() => {
    if (networkId === undefined) {
      return undefined;
    } else {
      return networkId.toString() === config.networkId;
    }
  }, [networkId, config.networkId]);

  return {
    isCorrectNetwork,
    networkId,
    accountIngressContract: contracts.accountIngressContract,
    nodeIngressContract: contracts.nodeIngressContract
  };
};
