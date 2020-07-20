// Libs
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { NodeRules } from '../chain/@types/NodeRules';
import { nodeRulesFactory } from '../chain/contracts/NodeRules';
import { useNetwork } from './network';

// Utils
import { paramsToIdentifier, Enode as RawEnode } from '../util/enodetools';

type Enode = RawEnode & { identifier: string };

type ContextType =
  | {
      nodeList: Enode[];
      setNodeList: React.Dispatch<React.SetStateAction<Enode[]>>;
      nodeReadOnly?: boolean;
      setNodeReadOnly: React.Dispatch<React.SetStateAction<boolean | undefined>>;
      nodeRulesContract?: NodeRules;
      setNodeRulesContract: React.Dispatch<React.SetStateAction<NodeRules | undefined>>;
    }
  | undefined;

const DataContext = createContext<ContextType>(undefined);

const loadNodeData = (
  nodeRulesContract: NodeRules | undefined,
  setNodeList: (account: Enode[]) => void,
  setNodeReadOnly: (readOnly?: boolean) => void
) => {
  if (nodeRulesContract === undefined) {
    setNodeList([]);
    setNodeReadOnly(undefined);
  } else {
    nodeRulesContract.functions.isReadOnly().then(isReadOnly => setNodeReadOnly(isReadOnly));
    nodeRulesContract.functions.getSize().then(listSize => {
      const listElementPromises = [];
      for (let i = 0; listSize.gt(i); i++) {
        listElementPromises.push(nodeRulesContract.functions.getByIndex(i));
      }
      Promise.all(listElementPromises).then(responses => {
        const updatedNodeList = responses.map(r => {
          const withStringyPort = { ...r, port: r.port.toString() };
          return {
            ...withStringyPort,
            identifier: paramsToIdentifier(withStringyPort)
          };
        });
        setNodeList(updatedNodeList);
      });
    });
  }
};

/**
 * Provider for the data context that contains the node list
 * @param {Object} props Props given to the NodeDataProvider
 * @return The provider with the following value:
 *  - nodeList: list of whiteliist enode from Node Rules contract
 *  - setNodeList: setter for the list state
 */
export const NodeDataProvider: React.FC<{}> = props => {
  const [nodeList, setNodeList] = useState<Enode[]>([]);
  const [nodeReadOnly, setNodeReadOnly] = useState<boolean | undefined>(undefined);
  const [nodeRulesContract, setNodeRulesContract] = useState<NodeRules | undefined>(undefined);

  const value = useMemo(
    () => ({ nodeList, setNodeList, nodeReadOnly, setNodeReadOnly, nodeRulesContract, setNodeRulesContract }),
    [nodeList, setNodeList, nodeReadOnly, setNodeReadOnly, nodeRulesContract, setNodeRulesContract]
  );

  const { nodeIngressContract } = useNetwork();

  useEffect(() => {
    if (nodeIngressContract === undefined) {
      setNodeRulesContract(undefined);
    } else {
      nodeRulesFactory(nodeIngressContract).then(contract => {
        setNodeRulesContract(contract);
        contract.removeAllListeners('NodeAdded');
        contract.removeAllListeners('NodeRemoved');
        contract.on('NodeAdded', () => {
          loadNodeData(contract, setNodeList, setNodeReadOnly);
        });
        contract.on('NodeRemoved', () => {
          loadNodeData(contract, setNodeList, setNodeReadOnly);
        });
      });
    }
  }, [nodeIngressContract]);

  return <DataContext.Provider value={value} {...props} />;
};

/**
 * Fetch the appropriate node data on chain and synchronize with it
 * @return {Object} Contains data of interest:
 *  - dataReady: true if isReadOnly and node allowlist are correctly fetched,
 *  false otherwise
 *  - userAddress: Address of the user
 *  - isReadOnly: Node contract is lock or unlock,
 *  - allowlist: list of permitted nodes from Node contract,
 */
export const useNodeData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useNodeData must be used within a NodeDataProvider.');
  }

  const { nodeList, setNodeList, nodeReadOnly, setNodeReadOnly, nodeRulesContract } = context;

  useEffect(() => {
    loadNodeData(nodeRulesContract, setNodeList, setNodeReadOnly);
  }, [nodeRulesContract, setNodeList, setNodeReadOnly]);

  const formattedNodeList = useMemo(() => {
    return nodeList.map(enode => ({ ...enode, status: 'active' })).reverse();
  }, [nodeList]);

  const dataReady = useMemo(() => {
    return nodeRulesContract !== undefined && nodeReadOnly !== undefined && nodeList !== undefined;
  }, [nodeRulesContract, nodeReadOnly, nodeList]);

  return {
    dataReady,
    allowlist: formattedNodeList,
    isReadOnly: nodeReadOnly,
    nodeRulesContract
  };
};
