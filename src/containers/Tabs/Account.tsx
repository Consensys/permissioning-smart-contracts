// Libs
import React from 'react';
import PropTypes from 'prop-types';
import { isAddress } from 'web3-utils';
import idx from 'idx';
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

type Account = {
  address: string;
  identifier: string;
  status: string;
};

const AccountTabContainer: React.FC<AccountTabContainerProps> = ({ isOpen }) => {
  const { isAdmin, dataReady: adminDataReady } = useAdminData();
  const { whitelist, isReadOnly, dataReady, accountRulesContract } = useAccountData();

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

  const handleAdd = async (value: string) => {
    // const gas = await accountRulesContract!.estimate.addAccount(value)
    try {
      const tx = await accountRulesContract!.functions.addAccount(value);
      toggleModal('add')();
      addTransaction(value, PENDING_ADDITION);
      const receipt = await tx.wait(1); // wait on receipt confirmations
      const addEvent = receipt.events!.filter(e => e.event && e.event === 'AccountAdded').pop();
      if (!addEvent) {
        openToast(value, FAIL, `Error while processing account: ${value}`);
      } else {
        const addSuccessResult = idx(addEvent, _ => _.args[0]);
        if (addSuccessResult === undefined) {
          openToast(value, FAIL, `Error while processing account: ${value}`);
        } else if (Boolean(addSuccessResult)) {
          openToast(value, SUCCESS, `New whitelisted account processed: ${value}`);
        } else {
          openToast(value, FAIL, `Account "${value}" is already on whitelist`);
        }
      }
      deleteTransaction(value);
    } catch (e) {
      toggleModal('add')(false);
      updateTransaction(value, FAIL_ADDITION);
      errorToast(e, value, openToast, () =>
        openToast(
          value,
          FAIL,
          'Could not add whitelisted account',
          `${value} was unable to be added. Please try again.`
        )
      );
    }
  };

  const handleRemove = async (value: string) => {
    try {
      const est = await accountRulesContract!.estimate.removeAccount(value);
      const tx = await accountRulesContract!.functions.removeAccount(value, { gasLimit: est.toNumber() * 2 });
      toggleModal('remove')();
      addTransaction(value, PENDING_REMOVAL);
      await tx.wait(1); // wait on receipt confirmations
      openToast(value, SUCCESS, `Removal of whitelisted account processed: ${value}`);
      deleteTransaction(value);
    } catch (e) {
      console.log('error', e);
      toggleModal('remove')();
      updateTransaction(value, FAIL_REMOVAL);
      errorToast(e, value, openToast, () =>
        openToast(
          value,
          FAIL,
          'Could not remove whitelisted account',
          `${value} was unable to be removed. Please try again.`
        )
      );
    }
  };

  const isValidAccount = (address: string) => {
    let isValidAddress = isAddress(address);
    if (!isValidAddress) {
      return {
        valid: false
      };
    }

    let isDuplicateAccount = list.filter((item: Account) => address === item.address).length > 0;
    if (isDuplicateAccount) {
      return {
        valid: false,
        msg: 'Account address is already on whitelist.'
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
        modals={modals}
        toggleModal={toggleModal}
        handleAdd={handleAdd}
        handleRemove={handleRemove}
        isAdmin={isAdmin}
        deleteTransaction={deleteTransaction}
        isValid={isValidAccount}
        isOpen={isOpen}
        isReadOnly={isReadOnly!}
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
