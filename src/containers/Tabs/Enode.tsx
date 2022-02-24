// Libs
import React from 'react';
import PropTypes from 'prop-types';
import idx from 'idx';
import { utils } from 'ethers';
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
  isEqual,
  isValidEnode,
  getGeohash
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
import { CollectionsOutlined } from '@material-ui/icons';
//import { group } from 'console';

type EnodeTabContainerProps = {
  isOpen: boolean;
};

const EnodeTabContainer: React.FC<EnodeTabContainerProps> = ({ isOpen }) => {
 // const types = { Bootnode: 0, Validator: 1, Writer: 2, Observer: 3 };
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

  if (!!nodeRulesContract) {
    const handleAdd = async (enode:string,nodeType:string, nodeName:string,nodeOrganization:string) => {
     //const { enode, type, organization, name, did, group } = value;
     // const { enodeHigh, enodeLow, ip, port } = enodeToParams(enode);
     let group = ""
     let nodeTypeValue = 3
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
        nodeTypeValue=3
        group=""
    }
    const did ='N/A'
   // const organization='lacchain'
    const { enodeHigh, enodeLow, ip, port} = enodeToParams(enode);
    const geoHash ="0x00646a6e3431" //await getGeohash(ip);
    
      const identifier = paramsToIdentifier({
        enodeHigh,
        enodeLow,
        ip,
        port,
        nodeType: nodeTypeValue,
        geoHash,
        name:nodeName,
        organization:nodeOrganization,
        did,
        group
      });
      try {
        const tx = await nodeRulesContract!.functions.addEnode(
          utils.hexlify(enodeHigh),
          utils.hexlify(enodeLow),
          utils.hexlify(ip),
          utils.bigNumberify(port),
          // @ts-ignore
         // utils.hexlify(types[nodeType]),
         nodeTypeValue,
          geoHash,
          nodeName,
          nodeOrganization,
          did,
          group
        );
      
        toggleModal('add')(false);
        addTransaction(identifier, PENDING_ADDITION);
        const receipt = await tx.wait(3); // wait on receipt confirmations
     
        const addEvent = receipt.events!.filter(e => e.event && e.event === 'NodeAdded').pop();
        if (!addEvent) {
          openToast(enode, FAIL, `Error while processing node: ${enode}`);
        } else {
          const addSuccessResult = idx(addEvent, _ => _.args[0]);
          if (addSuccessResult === undefined) {
            openToast(enode, FAIL, `Error while adding node: ${enode}`);
          } else if (Boolean(addSuccessResult)) {
            openToast(enode, SUCCESS, `New node added: ${enode}`);
          } else {
            openToast(enode, FAIL, `Node "${enode}" is already added`);
          }
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
          utils.bigNumberify(port)
        );
        const tx = await nodeRulesContract!.functions.removeEnode(
          utils.hexlify(enodeHigh),
          utils.hexlify(enodeLow),
          utils.hexlify(ip),
          utils.bigNumberify(port),
          {
            gasLimit: est.toNumber() * 2
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
            gasLimit: est.toNumber() * 2
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
            gasLimit: est.toNumber() * 2
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
      return false; //list.filter((item: Enode) => isEqual(item, enodeToParams(enode))).length > 0;
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
          list={list}
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
