// Libs
import React, {useState,useMemo} from 'react';
import PropTypes from 'prop-types';
import idx from 'idx';
import { utils } from 'ethers';
import hexToIp from '../../util/ipConverter';
// Context
import { useAdminData } from '../../context/adminData';
import { useNodeData } from '../../context/nodeData';
// Utils
import useTab from './useTab';
import useTransactionTab from './useTransactionTab';
import {
  identifierToParams,
  identifierToParamsTransaction,
  paramsToIdentifier,
  enodeToParams,
  Enode,
  isValidEnode
} from '../../util/enodetools';
import { errorToast } from '../../util/tabTools';
// Components
import EnodeTab from '../../components/EnodeTab/EnodeTab';
import LoadingPage from '../../components/LoadingPage/LoadingPage';
import NoContract from '../../components/Flashes/NoContract';
// Constants
import {
  PENDING_ADDITION,
  PENDING_REMOVAL,
  FAIL_ADDITION,
  FAIL_REMOVAL,
  PENDING_CONFIRM,
  FAIL_CONFIRM,
  PENDING_REVOKE,
  FAIL_REVOKE,
  SUCCESS,
  FAIL
} from '../../constants/transactions';
//import { CollectionsOutlined } from '@material-ui/icons';


type EnodeTabContainerProps = {
  isOpen: boolean;
};

const EnodeTabContainer: React.FC<EnodeTabContainerProps> = ({ isOpen }) => {
 // const types = { Bootnode: 0, Validator: 1, Writer: 2, Observer: 3 };

 const [selectTypeSearch, setSelectTypeSearch] = useState('');
 const [searchType, setSearchType] = useState("")
 const [searchOrganization, setSearchOrganization] = useState("")
 const [inputSearchOrganization, setInputSearchOrganization] = useState('');
 
 const modifySelectType = ({ target: { value } }: { target: { value: string } }) => {
  setSelectTypeSearch(value);
 };
 const modifyInputSearchOrganization = ({ target: { value } }: { target: { value: string } }) => {
  setInputSearchOrganization(value);
 };

 const getType= (value: string) =>{
    let nodeTypeValue = ""
    switch (value) {
    case 'Bootnode':
      nodeTypeValue="0"
    
      break;
    case 'Validator':
      nodeTypeValue="1"

      break;
    case 'Writer':
      nodeTypeValue="2"

      break;
    case 'Observer':
      nodeTypeValue="3"

      break;
    default:
      nodeTypeValue=""
  
  }
  return nodeTypeValue
 }
 const handleSearch = (e: MouseEvent) => {
   e.preventDefault();
   setSearchType(selectTypeSearch)
   setSearchOrganization(inputSearchOrganization)
 };
 
 const handleClear = (e: MouseEvent) => {
   e.preventDefault();
   setSearchType("")
   setSelectTypeSearch("")
   setSearchOrganization("")
   setInputSearchOrganization("")
 };

  const { isAdmin, dataReady: adminDataReady } = useAdminData();
  const { allowlist,allowlistTransacion, isReadOnly, dataReady, nodeRulesContract } = useNodeData();

  const { list, modals, toggleModal, addTransaction, updateTransaction, deleteTransaction, openToast } = useTab(
    allowlist,
    identifierToParams
  );
  const { listTransaction } = useTransactionTab(
    allowlistTransacion,
    identifierToParamsTransaction
  );

  const listFilter=useMemo(()=>  list.filter(row=> {
    //  return  row.organization .toString().includes(searchOrganization) || row.ip.includes( searchOrganization ) ;
    if (searchType===""){
      const {enodeHigh} = enodeToParams(searchOrganization)
      if (enodeHigh===""){
        return  row.organization.toString().includes(searchOrganization) 
      || hexToIp(row.ip).includes( searchOrganization ) ;
      }else{
        return    row.enodeHigh.includes(enodeHigh);
      }
      
    }else if (searchOrganization===""){
      return row.nodeType.toString().includes(getType(searchType)  ) ;
    }else{
      const {enodeHigh} = enodeToParams(searchOrganization)
      if (enodeHigh===""){
        return row.nodeType.toString().includes(getType(searchType)  ) 
        && (row.organization.toString().includes(searchOrganization )  || hexToIp(row.ip).includes( searchOrganization )  );
      }else{
        return row.nodeType.toString().includes(getType(searchType)  ) 
        && (  row.enodeHigh.includes(enodeHigh));
      }   
    } 
  }
  ),[searchType,searchOrganization,list]);
  
  if (!!nodeRulesContract) {
    const handleAdd = async (enode:string,nodeType:string, nodeName:string,nodeOrganization:string, nodeGeoHash:string , nodeDid:string) => {
     //const { enode, type, organization, name, did, group } = value;
     // const { enodeHigh, enodeLow, ip, port } = enodeToParams(enode);
     let group = ""
     let nodeTypeValue = 0
     switch (nodeType) {
      case 'Bootnode':
        nodeTypeValue=0
        group="0x5B950E77941D01CDF246D00B1ECE546BC95234B77D98B44C9187E2733AFA696A"
        break;
      case 'Validator':
        nodeTypeValue=1
        group="0xDAE96FC0046A5AE1864D9A66E6715DA8DA08240E7119816AB722261C0744D8E8"
        break;
      case 'Writer':
        nodeTypeValue=2
        group="0x4BB48E76F19DE6EBED7D59D46800508030AECEA46BA56BD19855D94473E28BC0"
        break;
      case 'Observer':
        nodeTypeValue=3
        group=""
        break;
      default:
        nodeTypeValue=0
        group=""
    }

    const { enodeHigh, enodeLow, ip, port} = enodeToParams(enode);
    //const geoHash ="0x00646a6e3431" //await getGeohash(ip);
    
      const identifier = paramsToIdentifier({
        enodeHigh,
        enodeLow,
        ip,
        port,
        nodeType: nodeTypeValue,
        geoHash:nodeGeoHash,
        name:nodeName,
        organization:nodeOrganization,
        did:nodeDid,
        group
      });

      try {
        // console.log("nodeName:" +nodeName )
        // console.log("nodeOrganization:" +nodeOrganization )
        const tx = await nodeRulesContract!.functions.addEnode(
          utils.hexlify(enodeHigh),
          utils.hexlify(enodeLow),
          utils.hexlify(ip),
          utils.bigNumberify(port),
          // @ts-ignore
         // utils.hexlify(types[nodeType]),
         nodeTypeValue,
         nodeGeoHash,
          nodeName,
          nodeOrganization,
          nodeDid,
          group
        );
      
        toggleModal('add')(false);
        addTransaction(identifier, PENDING_ADDITION);
        const receipt = await tx.wait(3); // wait on receipt confirmations
      
       // const addEvent = receipt.events!.filter(e => e.event && e.event === 'NodeAdded').pop();
        const addEvent = receipt.events!.filter(e => e.event && e.event === 'TransactionAdded').pop();
        if (!addEvent) {
          openToast(enode, FAIL, `Error while processing node: ${enode}`);
        } else {
          const addSuccessResult = idx(addEvent, _ => _.args[0]);
          
          if (addSuccessResult === undefined) {
            openToast(enode, FAIL, `Error while adding node: ${enode}`);
          }else{ //else if (Boolean(addSuccessResult)) {
            openToast(enode, SUCCESS, `New node added: ${enode}`);
          }
          // } else {
          //   openToast(enode, FAIL, `Node "${enode}" is already added`);
          // }
        }
        deleteTransaction(identifier);
      } catch (e) {
        console.log(e)
        toggleModal('add')(false);
        updateTransaction(identifier, FAIL_ADDITION);
        errorToast(e, identifier, openToast, () =>
          openToast(
            identifier,
            FAIL,
            'Could not add node',
            `${enodeHigh}${enodeLow} was unable to be added. Please try again`
          )
        );
      }
    };

    const handleRemove = async (enode: string) => {
      const { enodeHigh, enodeLow, ip, port } = identifierToParams(enode);
      try {
        const est = await nodeRulesContract!.estimate.removeEnode(
          utils.hexlify(enodeHigh),
          utils.hexlify(enodeLow),
          utils.hexlify(ip),
          utils.bigNumberify(port),
          {
            gasLimit:  300000
          }
        );
        const tx = await nodeRulesContract!.functions.removeEnode(
          utils.hexlify(enodeHigh),
          utils.hexlify(enodeLow),
          utils.hexlify(ip),
          utils.bigNumberify(port),
          {
            gasLimit: est.toNumber() + 300000
          }
        );
        toggleModal('remove')(false);
        addTransaction(enode, PENDING_REMOVAL);
        await tx.wait(1); // wait on recehostt confirmations
        openToast(enode, SUCCESS, `Removal of node processed: ${enodeHigh}${enodeLow}`);
        deleteTransaction(enode);
      } catch (e) {
        toggleModal('remove')(false);
        updateTransaction(enode, FAIL_REMOVAL);
        errorToast(e, enode, openToast, () =>
          openToast(
            enode,
            FAIL,
            'Could not remove node',
            `${enodeHigh}${enodeLow} was unable to be removed. Please try again.`
          )
        );
      }
    };
    const handleConfirm = async (value: number) => {
      
      try {
        const est = await nodeRulesContract!.estimate.confirmTransaction(value);
        
        const tx = await nodeRulesContract!.functions.confirmTransaction(
          value,
          {
            gasLimit: est.toNumber()  + 300000
          }
        );

        //toggleModal('remove')(false);
        addTransaction(value.toString(), PENDING_CONFIRM);
        await tx.wait(1); // wait on recehostt confirmations
        openToast(value.toString(), SUCCESS, `Confirm  of node processed: ${value}`);
        deleteTransaction(value.toString());
      } catch (e) {
        //toggleModal('remove')(false);
        updateTransaction(value.toString(), FAIL_CONFIRM);
        errorToast(e, value.toString(), openToast, () =>
          openToast(
            value.toString(),
            FAIL,
            'Could not Confirm node',
            `${value} was unable to be Confirmed. Please try again.`
          )
        );
      }
    };
    const handleRevoke = async (value: number) => {
      
      try {
        const est = await nodeRulesContract!.estimate.revokeConfirmation(value);
        const tx = await nodeRulesContract!.functions.revokeConfirmation(
          value,
          {
            gasLimit: est.toNumber() + 300000
          }
        );
        //toggleModal('remove')(false);
        addTransaction(value.toString(), PENDING_REVOKE);
        await tx.wait(1); // wait on recehostt confirmations
        openToast(value.toString(), SUCCESS, `Confirm  of node processed: ${value}`);
        deleteTransaction(value.toString());
      } catch (e) {
        //toggleModal('remove')(false);
        updateTransaction(value.toString(), FAIL_REVOKE);
        errorToast(e, value.toString(), openToast, () =>
          openToast(
            value.toString(),
            FAIL,
            'Could not Confirm node',
            `${value} was unable to be Confirmed. Please try again.`
          )
        );
      }
    };

    const isDuplicateEnode = (enode: string) => {
      //return list.filter((item: Enode) => isEqual(item, enodeToParams(enode))).length > 0;
      let lat =list.filter((item: Enode) =>{ 
       let newT= enodeToParams(enode)
        return (item.enodeHigh=== newT.enodeHigh && item.enodeLow===newT.enodeLow && item.ip=== newT.ip )
      }).length > 0;
     
      return lat
    };

    const isValid = (enode: string) => {
      if (!isValidEnode(enode)) {
        return {
          valid: false
        };
      } else if (isDuplicateEnode(enode)) {
        return {
          valid: false,
          msg: 'Specified enode is already added.'
        };
      } else {
        return {
          valid: true
        };
      }
    };

    const allDataReady = dataReady && adminDataReady;
    if (isOpen && allDataReady) {
      return (
        <EnodeTab
        selectTypeSearch={selectTypeSearch}
        modifySelectType={modifySelectType}
        handleSearch={handleSearch}
        handleClear={handleClear}
        inputSearchOrganization={inputSearchOrganization}
        modifyInputSearchOrganization={modifyInputSearchOrganization}
          list={listFilter}
          listTransaction={listTransaction}
          modals={modals}
          toggleModal={toggleModal}
          handleAdd={handleAdd}
          handleRemove={handleRemove}
          handleConfirm={handleConfirm}
          handleRevoke={handleRevoke}
          isAdmin={isAdmin}
          deleteTransaction={deleteTransaction}
          isValid={isValid}
          isReadOnly={isReadOnly!}
          isOpen={isOpen}
        />
      );
    } else if (isOpen && !allDataReady) {
      return <LoadingPage />;
    } else {
      return <div />;
    }
  } else if (isOpen && !nodeRulesContract) {
    return <NoContract tabName="Node Rules" />;
  } else {
    return <div />;
  }
};

EnodeTabContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired
};

export default EnodeTabContainer;
