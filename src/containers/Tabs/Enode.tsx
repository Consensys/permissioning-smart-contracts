// Libs
import React from 'react';
import { drizzleReactHooks } from 'drizzle-react';
import PropTypes from 'prop-types';
import idx from 'idx';
import { TransactionObject } from 'web3/eth/types';
import { utils } from 'ethers';
// Context
import { useAdminData } from '../../context/adminData';
import { useNodeData } from '../../context/nodeData';
// Utils
import useTab from './useTab';
import {
  identifierToParams,
  paramsToIdentifier,
  enodeToParams,
  Enode,
  isEqual,
  isValidEnode
} from '../../util/enodetools';
import { errorToast } from '../../util/tabTools';
// Components
import EnodeTab from '../../components/EnodeTab/EnodeTab';
import LoadingPage from '../../components/LoadingPage/LoadingPage';
// Constants
import {
  PENDING_ADDITION,
  PENDING_REMOVAL,
  FAIL_ADDITION,
  FAIL_REMOVAL,
  SUCCESS,
  FAIL
} from '../../constants/transactions';

type EnodeTabContainerProps = {
  isOpen: boolean;
};

const EnodeTabContainer: React.FC<EnodeTabContainerProps> = ({ isOpen }) => {
  const { isAdmin, dataReady: adminDataReady } = useAdminData();
  const { userAddress, whitelist, isReadOnly, dataReady, nodeRulesContract } = useNodeData();

  const { list, modals, toggleModal, addTransaction, updateTransaction, deleteTransaction, openToast } = useTab(
    whitelist,
    identifierToParams
  );

  const { drizzle } = drizzleReactHooks.useDrizzle();

  const { removeEnode } = drizzle.contracts.NodeRules.methods as {
    removeEnode: (enodeHigh: string, enodeLow: string, ip: string, port: string) => TransactionObject<never>;
  };

  const handleAdd = async (value: string) => {
    const { enodeHigh, enodeLow, ip, port } = enodeToParams(value);
    const identifier = paramsToIdentifier({
      enodeHigh,
      enodeLow,
      ip,
      port
    });

    try {
      const tx = await nodeRulesContract!.functions.addEnode(
        utils.hexlify(enodeHigh),
        utils.hexlify(enodeLow),
        utils.hexlify(ip),
        utils.bigNumberify(port)
      );
      toggleModal('add')();
      addTransaction(identifier, PENDING_ADDITION);
      const receipt = await tx.wait(1);
      const addEvent = receipt.events!.filter(e => e.event && e.event === 'NodeAdded').pop();
      if (!addEvent) {
        openToast(value, FAIL, `Error while processing node: ${value}`);
      } else {
        const addSuccessResult = idx(addEvent, _ => _.args[0]);
        if (addSuccessResult === undefined) {
          openToast(value, FAIL, `Error while processing node: ${value}`);
        } else if (Boolean(addSuccessResult)) {
          openToast(value, SUCCESS, `New whitelist node processed: ${value}`);
        } else {
          openToast(value, FAIL, `Node "${value}" is already on whitelist`);
        }
      }
    } catch (e) {
      toggleModal('add')();
      updateTransaction(identifier, FAIL_ADDITION);
      errorToast(e, identifier, openToast, () =>
        openToast(
          identifier,
          FAIL,
          'Could not add node to whitelist',
          `${enodeHigh}${enodeLow} was unable to be added. Please try again`
        )
      );
    }
  };

  const handleRemove = async (value: string) => {
    const { enodeHigh, enodeLow, ip, port } = identifierToParams(value);
    const gasLimit = await removeEnode(enodeHigh, enodeLow, ip, port).estimateGas({ from: userAddress });
    removeEnode(enodeHigh, enodeLow, ip, port)
      .send({ from: userAddress, gas: gasLimit * 4 })
      .on('transactionHash', () => {
        toggleModal('remove')();
        addTransaction(value, PENDING_REMOVAL);
      })
      .on('receipt', () => {
        openToast(value, SUCCESS, `Removal of whitelisted node processed: ${enodeHigh}${enodeLow}`);
      })
      .on('error', error => {
        toggleModal('remove')();
        updateTransaction(value, FAIL_REMOVAL);
        errorToast(error, value, openToast, () =>
          openToast(
            value,
            FAIL,
            'Could not remove node to whitelist',
            `${enodeHigh}${enodeLow} was unable to be removed. Please try again.`
          )
        );
      });
  };

  const isDuplicateEnode = (enode: string) => {
    return list.filter((item: Enode) => isEqual(item, enodeToParams(enode))).length > 0;
  };

  const isValid = (enode: string) => {
    if (!isValidEnode(enode)) {
      return {
        valid: false
      };
    } else if (isDuplicateEnode(enode)) {
      return {
        valid: false,
        msg: 'Specified enode is already on whitelist.'
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
        userAddress={userAddress}
        modals={modals}
        toggleModal={toggleModal}
        handleAdd={handleAdd}
        handleRemove={handleRemove}
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
};

EnodeTabContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired
};

export default EnodeTabContainer;
