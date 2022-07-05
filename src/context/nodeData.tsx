// Libs
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { NodeRules } from '../chain/@types/NodeRules';
import { nodeRulesFactory } from '../chain/contracts/NodeRules';
import { useNetwork } from './network';
import { ethers } from 'ethers';
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
    }
  | undefined;

const DataContext = createContext<ContextType>(undefined);
const AbiCoder =ethers.utils.defaultAbiCoder
const loadNodeData = (
  nodeRulesContract: NodeRules | undefined,

  setNodeList: (node: Enode[]) => void,
  setNodeTransactionList: (node: EnodeTransacion[]) => void,
  setNodeReadOnly: (readOnly?: boolean) => void
) => {
  if (nodeRulesContract === undefined ) {
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
  
    nodeRulesContract.functions.getTransactionCount(true,false).then(countTransaction =>{
     // console.log("countTransaction:"+countTransaction)
      nodeRulesContract.functions.getTransactionIds(0,countTransaction,true,false).then(listTransaction=>{
          const listElementsPromisesTransaction = [];
          console.log(listTransaction.length)
          for (let i = 0; i< listTransaction.length; i++) {
            console.log(listTransaction[i].toNumber())
            if (listTransaction[i].toNumber() >=0){
           //   console.log("id-transacion-"+listTransaction[i])
              listElementsPromisesTransaction.push(nodeRulesContract.functions.getTransaction(listTransaction[i]));
            }
          }
          
          Promise.all(listElementsPromisesTransaction).then(responses => {
            const updatedNodeList = responses.map(r => {
                  const payload = r[0]
                  const executed= r[1]
                  const transactionID = r[2]
                  const nameFunc = payload.slice(2,10);
                  console.log(nameFunc)
                  let  withStringyPort={enodeHigh: "",
                    enodeLow: "",
                    ip: "",
                    port: "",
                    nodeType: 0,
                    geoHash: "",
                    organization: "",
                    name: "",
                    did: "",
                    group: "",
                    executed:executed ,
                      transactionId:transactionID.toNumber()
                      }

                  if (nameFunc ==="2444b823"){//remove
                    const   decode= AbiCoder.decode([  "bytes32","bytes32","bytes16","uint16"],"0x"+ payload.slice(10,payload.length));
                     withStringyPort = {         
                      enodeHigh: decode[0],
                      enodeLow: decode[1],
                      ip: decode[2],
                      port: decode[3].toString(),
                      nodeType: 0,
                      geoHash: "",
                      organization: "",
                      name: "",
                      did: "",
                      group: "",
                      executed:executed ,
                       transactionId:transactionID.toNumber()
                       };
                  }else if (nameFunc ==="afe76f5c"){
                    const decode= AbiCoder.decode([  "bytes32","bytes32","bytes16","uint16","uint8","bytes6","string","string","string","bytes32"],"0x"+ payload.slice(10,payload.length));
                       withStringyPort = {         
                        enodeHigh: decode[0],
                        enodeLow: decode[1],
                        ip: decode[2],
                        port: decode[3].toString(),
                        nodeType: decode[4],
                        geoHash: decode[5],
                        name: decode[6],
                        organization: decode[7],
                        did: decode[8],
                        group: decode[9],
                        executed:executed ,
                        transactionId:transactionID.toNumber()
                        };
                        
                  }
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

  const value = useMemo(
    () => ({ nodeList, setNodeList,nodeTransactionList, setNodeTransactionList, nodeReadOnly, setNodeReadOnly, nodeRulesContract, setNodeRulesContract }),
    [nodeList, setNodeList,nodeTransactionList, setNodeTransactionList, nodeReadOnly, setNodeReadOnly, nodeRulesContract, setNodeRulesContract]
  );

  const { nodeIngressContract } = useNetwork();

  useEffect(() => {
    if (nodeIngressContract === undefined) {
      setNodeRulesContract(undefined);
    } else {
      
        nodeRulesFactory(nodeIngressContract).then(contract => {
          setNodeRulesContract(contract);


            contract.removeAllListeners('TransactionAdded');
            contract.removeAllListeners('NodeRemoved');
            contract.removeAllListeners('Confirmation');
            contract.removeAllListeners('Revocation');
            
            
            
            contract.on('TransactionAdded', () => {
              loadNodeData(contract, setNodeList,setNodeTransactionList, setNodeReadOnly);
            });
            contract.on('NodeRemoved', () => {
              loadNodeData(contract,setNodeList, setNodeTransactionList,setNodeReadOnly);
            });
            contract.on('Confirmation', () => {
              loadNodeData(contract,setNodeList, setNodeTransactionList,setNodeReadOnly);
            });
            contract.on('Revocation', () => {
              loadNodeData(contract,setNodeList, setNodeTransactionList,setNodeReadOnly);
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

  const { nodeList, setNodeList, nodeTransactionList, setNodeTransactionList,nodeReadOnly, setNodeReadOnly, nodeRulesContract } = context;

  useEffect(() => {
    loadNodeData(nodeRulesContract, setNodeList,setNodeTransactionList, setNodeReadOnly);
  }, [nodeRulesContract, setNodeList,setNodeTransactionList, setNodeReadOnly]);

  const formattedNodeList = useMemo(() => {
    return nodeList.map(enode => ({ ...enode, status: 'active'})).reverse();
  }, [nodeList]);

  const formattedNodeTransactionList = useMemo(() => {
    return nodeTransactionList.map(enode => ({ ...enode, status:(enode.executed) ?  'active': 'pendingAddition' })).reverse();
  }, [nodeTransactionList]);

  const dataReady = useMemo(() => {
    return nodeRulesContract !== undefined && nodeReadOnly !== undefined && nodeList !== undefined  && nodeTransactionList !== undefined; 
  }, [nodeRulesContract, nodeReadOnly, nodeList,nodeTransactionList]);

  return {
    dataReady,
    allowlist: formattedNodeList,
    allowlistTransacion: formattedNodeTransactionList,
    isReadOnly: nodeReadOnly,
    nodeRulesContract
  };
};
