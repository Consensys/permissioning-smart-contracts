// Libs
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { NodeRules } from '../chain/@types/NodeRules';
import { nodeRulesFactory } from '../chain/contracts/NodeRules';
import { useNetwork } from './network';

// Utils
import { paramsToIdentifier, Enode } from '../util/enodetools';

type ContextType =
  | {
      nodeWhitelist: Enode[];
      setNodeWhitelist: React.Dispatch<React.SetStateAction<Enode[]>>;
      nodeReadOnly?: boolean;
      setNodeReadOnly: React.Dispatch<React.SetStateAction<boolean | undefined>>;
      nodeRulesContract?: NodeRules;
      setNodeRulesContract: React.Dispatch<React.SetStateAction<NodeRules | undefined>>;
    }
  | undefined;

const DataContext = createContext<ContextType>(undefined);

/**
 * Provider for the data context that contains the node whitelist
 * @param {Object} props Props given to the NodeDataProvider
 * @return The provider with the following value:
 *  - nodeWhitelist: list of whiteliist enode from Node Rules contract
 *  - setNodeWhitelist: setter for the whitelist state
 */
export const NodeDataProvider: React.FC<{}> = props => {
  const [nodeWhitelist, setNodeWhitelist] = useState<Enode[]>([]);
  const [nodeReadOnly, setNodeReadOnly] = useState<boolean | undefined>(undefined);
  const [nodeRulesContract, setNodeRulesContract] = useState<NodeRules | undefined>(undefined);

  const value = useMemo(
    () => ({ nodeWhitelist, setNodeWhitelist, nodeReadOnly, setNodeReadOnly, nodeRulesContract, setNodeRulesContract }),
    [nodeWhitelist, setNodeWhitelist, nodeReadOnly, setNodeReadOnly, nodeRulesContract, setNodeRulesContract]
  );

  const { nodeIngressContract } = useNetwork();

  useEffect(() => {
    if (nodeIngressContract === undefined) {
      setNodeRulesContract(undefined);
    } else {
      nodeRulesFactory(nodeIngressContract).then(contract => setNodeRulesContract(contract));
    }
  }, [nodeIngressContract]);

  return <DataContext.Provider value={value} {...props} />;
};

/**
 * Fetch the appropriate node data on chain and synchronize with it
 * @return {Object} Contains data of interest:
 *  - dataReady: true if isReadOnly and node whitelist are correctly fetched,
 *  false otherwise
 *  - userAddress: Address of the user
 *  - isReadOnly: Node contract is lock or unlock,
 *  - whitelist: list of whitelist nodes from Node contract,
 */
export const useNodeData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useNodeData must be used within a NodeDataProvider.');
  }

  const { nodeWhitelist, setNodeWhitelist, nodeReadOnly, setNodeReadOnly, nodeRulesContract } = context;

  useEffect(() => {
    if (nodeRulesContract === undefined) {
      setNodeWhitelist([]);
      setNodeReadOnly(undefined);
    } else {
      nodeRulesContract.functions.isReadOnly().then(isReadOnly => setNodeReadOnly(isReadOnly));
      nodeRulesContract.functions.getSize().then(whitelistSize => {
        const whitelistElementPromises = [];
        for (let i = 0; whitelistSize.gt(i); i++) {
          whitelistElementPromises.push(nodeRulesContract.functions.getByIndex(i));
        }
        Promise.all(whitelistElementPromises).then(responses => {
          const updatedNodeWhitelist = responses.map(r => {
            const withStringyPort = { ...r, port: r.port.toString() };
            return {
              ...withStringyPort,
              identifier: paramsToIdentifier(withStringyPort)
            };
          });
          setNodeWhitelist(updatedNodeWhitelist);
        });
      });
    }
  }, [nodeRulesContract, setNodeWhitelist, setNodeReadOnly]);

  const formattedNodeWhitelist = useMemo(() => {
    return nodeWhitelist ? nodeWhitelist.map(enode => ({ ...enode, status: 'active' })).reverse() : undefined;
  }, [nodeWhitelist]);

  const dataReady = useMemo(() => {
    return nodeRulesContract !== undefined && nodeReadOnly !== undefined && nodeWhitelist !== undefined;
  }, [nodeRulesContract, nodeReadOnly, nodeWhitelist]);

  return {
    dataReady,
    whitelist: formattedNodeWhitelist,
    isReadOnly: nodeReadOnly,
    nodeRulesContract
  };
};
