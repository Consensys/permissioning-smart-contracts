// Libs
import React from 'react';
import PropTypes from 'prop-types';
import { drizzleReactHooks } from 'drizzle-react';
import { isAddress } from 'web3-utils';
import idx from 'idx';
import { TransactionObject } from 'web3/eth/types';
// Context
import { useAccountData } from '../../context/accountData';
import { useAdminData } from '../../context/adminData';
// Utils
import useTab from './useTab';
import { errorToast } from '../../util/tabTools';
// Components
import AccountTab from '../../components/AccountTab/AccountTab';
import LoadingPage from '../../components/LoadingPage/LoadingPage';
// Constants
import {
  PENDING_ADDITION,
  FAIL_ADDITION,
  PENDING_REMOVAL,
  FAIL_REMOVAL,
  SUCCESS,
  FAIL
} from '../../constants/transactions';

type AccountTabContainerProps = {
  isOpen: boolean;
};

const AccountTabContainer: React.FC<AccountTabContainerProps> = ({ isOpen }) => {
  const { isAdmin, dataReady: adminDataReady } = useAdminData();
  const { userAddress, whitelist, isReadOnly, dataReady } = useAccountData();

  const {
    list,
    modals,
    toggleModal,
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    openToast
  } = useTab(whitelist, (identifier: string) => ({ address: identifier }));

  const { drizzle } = drizzleReactHooks.useDrizzle();

  const { addAccount, removeAccount } = drizzle.contracts.AccountRules.methods as {
    addAccount: (value: string) => TransactionObject<never>;
    removeAccount: (value: string) => TransactionObject<never>;
  };

  const handleAdd = async (value: string) => {
    const gasLimit = await addAccount(value).estimateGas({
      from: userAddress
    });
    addAccount(value)
      .send({ from: userAddress, gas: gasLimit * 4 })
      .on('transactionHash', () => {
        toggleModal('add')();
        addTransaction(value, PENDING_ADDITION);
      })
      .on('receipt', receipt => {
        const event = idx(receipt, _ => _.events.AccountAdded);
        const added = Boolean(idx(event, _ => _.returnValues.accountAdded));
        if (!event) {
          openToast(value, FAIL, `Error while processing account: ${value}`);
        } else if (added) {
          openToast(value, SUCCESS, `New whitelisted account processed: ${value}`);
        } else {
          openToast(value, FAIL, `Account "${value}" is already on whitelist`);
        }
      })
      .on('error', error => {
        toggleModal('add')();
        updateTransaction(value, FAIL_ADDITION);
        errorToast(error, value, openToast, () =>
          openToast(
            value,
            FAIL,
            'Could not add whitelisted account',
            `${value} was unable to be added. Please try again.`
          )
        );
      });
  };

  const handleRemove = async (value: string) => {
    const gasLimit = await removeAccount(value).estimateGas({
      from: userAddress
    });
    removeAccount(value)
      .send({ from: userAddress, gas: gasLimit * 4 })
      .on('transactionHash', () => {
        toggleModal('remove')();
        addTransaction(value, PENDING_REMOVAL);
      })
      .on('receipt', () => {
        openToast(value, SUCCESS, `Removal of whitelisted account processed: ${value}`);
      })
      .on('error', error => {
        toggleModal('remove')();
        updateTransaction(value, FAIL_REMOVAL);
        errorToast(error, value, openToast, () =>
          openToast(
            value,
            FAIL,
            'Could not remove whitelisted account',
            `${value} was unable to be removed. Please try again.`
          )
        );
      });
  };

  const isValidAccount = (address: string) => {
    let isValidAddress = isAddress(address);
    if (!isValidAddress) {
      return {
        valid: false
      };
    }

    return {
      valid: true
    };
  };

  const allDataReady: boolean = dataReady && adminDataReady;
  if (isOpen && allDataReady) {
    return (
      <AccountTab
        list={list}
        userAddress={userAddress}
        modals={modals}
        toggleModal={toggleModal}
        handleAdd={handleAdd}
        handleRemove={handleRemove}
        isAdmin={isAdmin}
        deleteTransaction={deleteTransaction}
        isValid={isValidAccount}
        isOpen={isOpen}
        isReadOnly={isReadOnly}
        pendingLock={!!transactions.get('lock')}
      />
    );
  } else if (isOpen && !allDataReady) {
    return <LoadingPage />;
  } else {
    return <div />;
  }
};

AccountTabContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired
};

export default AccountTabContainer;
