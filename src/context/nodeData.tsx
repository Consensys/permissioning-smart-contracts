// Libs
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { NodeRules } from '../chain/@types/NodeRules';
import { nodeRulesFactory } from '../chain/contracts/NodeRules';
import { NodeStorageMultiSig } from '../chain/@types/NodeStorageMultiSig';
import { nodeStorageMultiSigFactory } from '../chain/contracts/NodeStorageMultiSig';
import { useNetwork } from './network';

// Utils
import { paramsToIdentifier,paramsToIdentifierTransaction, Enode as RawEnode , EnodeTransaction as RawEnodeTransaction } from '../util/enodetools';

type Enode = RawEnode & { identifier: string };
type EnodeTransacion = RawEnodeTransaction & { identifier: string };
//type Enode = RawEnode & { identifier: string , executed:boolean , transactionId:number};
type ContextType =
  | {
      nodeList: Enode[];
      nodeTransactionList: EnodeTransacion[];
      setNodeList: React.Dispatch<React.SetStateAction<Enode[]>>;
      setNodeTransactionList: React.Dispatch<React.SetStateAction<EnodeTransacion[]>>;
      nodeReadOnly?: boolean;
      setNodeReadOnly: React.Dispatch<React.SetStateAction<boolean | undefined>>;
      nodeRulesContract?: NodeRules;
      setNodeRulesContract: React.Dispatch<React.SetStateAction<NodeRules | undefined>>;
      nodeStorageMultiSigContract?:NodeStorageMultiSig;
      setNodeStorageMultiSigContract: React.Dispatch<React.SetStateAction<NodeStorageMultiSig | undefined>>;
    }
  | undefined;

const DataContext = createContext<ContextType>(undefined);

const loadNodeData = (
  nodeRulesContract: NodeRules | undefined,
  nodeStorageMultiSigContract: NodeStorageMultiSig | undefined,
  setNodeList: (node: Enode[]) => void,
  setNodeTransactionList: (node: EnodeTransacion[]) => void,
  setNodeReadOnly: (readOnly?: boolean) => void
) => {
  if (nodeRulesContract === undefined || nodeStorageMultiSigContract === undefined) {
    setNodeList([]);
    setNodeTransactionList([]);
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
  

    nodeStorageMultiSigContract.functions.getTransactionCount(true,false).then(countTransaction =>{
   
      nodeStorageMultiSigContract.functions.getTransactionIds(0,countTransaction,true,false).then(listTransaction=>{
          const listElementsPromisesTransaction = [];
 
          for (let i = 0; i< listTransaction.length; i++) {
    
            listElementsPromisesTransaction.push(nodeStorageMultiSigContract.functions.getTransaction(listTransaction[i]));
          }
          Promise.all(listElementsPromisesTransaction).then(responses => {
            const updatedNodeList = responses.map(r => {
                    const withStringyPort = { 
                      enodeHigh: r.enodeHigh,
                      enodeLow: r.enodeLow,
                      ip: r.ip,
                      port: r.port.toString(),
                      nodeType: r.nodeType,
                      geoHash: r.geoHash,
                      organization: r.organization,
                      name: r.name,
                      did: r.did,
                      group: r.group,
                      executed:r.executed ,
                       transactionId:r.transactionid.toNumber()
                       };
                    return {
                      ...withStringyPort,
                      identifier: paramsToIdentifierTransaction(withStringyPort)
                    };
                  });
                  
                  setNodeTransactionList(updatedNodeList);
            
          });
          
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
  const [nodeTransactionList, setNodeTransactionList] = useState<EnodeTransacion[]>([]);
  const [nodeReadOnly, setNodeReadOnly] = useState<boolean | undefined>(undefined);
  const [nodeRulesContract, setNodeRulesContract] = useState<NodeRules | undefined>(undefined);
  const [ nodeStorageMultiSigContract,setNodeStorageMultiSigContract] = useState<NodeStorageMultiSig | undefined>(undefined);
  const value = useMemo(
    () => ({ nodeList, setNodeList,nodeTransactionList, setNodeTransactionList, nodeReadOnly, setNodeReadOnly, nodeRulesContract, setNodeRulesContract , nodeStorageMultiSigContract,setNodeStorageMultiSigContract}),
    [nodeList, setNodeList,nodeTransactionList, setNodeTransactionList, nodeReadOnly, setNodeReadOnly, nodeRulesContract, setNodeRulesContract, nodeStorageMultiSigContract,setNodeStorageMultiSigContract]
  );

  const { nodeIngressContract } = useNetwork();

  useEffect(() => {
    if (nodeIngressContract === undefined) {
      setNodeRulesContract(undefined);
    } else {
      
        nodeRulesFactory(nodeIngressContract).then(contract => {
          setNodeRulesContract(contract);
          nodeStorageMultiSigFactory(contract).then(storageContract => { 
            setNodeStorageMultiSigContract(storageContract);

            contract.removeAllListeners('TransactionAdded');
            contract.removeAllListeners('NodeRemoved');
            contract.on('TransactionAdded', () => {
              loadNodeData(contract,nodeStorageMultiSigContract, setNodeList,setNodeTransactionList, setNodeReadOnly);
            });
            contract.on('NodeRemoved', () => {
              loadNodeData(contract, nodeStorageMultiSigContract,setNodeList, setNodeTransactionList,setNodeReadOnly);
            });
          });
            
        });


    }
  }, [nodeIngressContract,nodeStorageMultiSigContract]);

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

  const { nodeList, setNodeList, nodeTransactionList, setNodeTransactionList,nodeReadOnly, setNodeReadOnly, nodeRulesContract ,nodeStorageMultiSigContract} = context;

  useEffect(() => {
    loadNodeData(nodeRulesContract,nodeStorageMultiSigContract, setNodeList,setNodeTransactionList, setNodeReadOnly);
  }, [nodeRulesContract,nodeStorageMultiSigContract, setNodeList,setNodeTransactionList, setNodeReadOnly]);

  const formattedNodeList = useMemo(() => {
    return nodeList.map(enode => ({ ...enode, status: 'active'})).reverse();
  }, [nodeList]);

  const formattedNodeTransactionList = useMemo(() => {
    return nodeTransactionList.map(enode => ({ ...enode, status:(enode.executed) ?  'active': 'pendingAddition' })).reverse();
  }, [nodeTransactionList]);

  const dataReady = useMemo(() => {
    return nodeRulesContract !== undefined && nodeReadOnly !== undefined && nodeList !== undefined  && nodeTransactionList !== undefined; 
  }, [nodeRulesContract,nodeStorageMultiSigContract, nodeReadOnly, nodeList,nodeTransactionList]);

  return {
    dataReady,
    allowlist: formattedNodeList,
    allowlistTransacion: formattedNodeTransactionList,
    isReadOnly: nodeReadOnly,
    nodeRulesContract,
    nodeStorageMultiSigContract
  };
};
