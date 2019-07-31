// Libs
import React from 'react';
import PropTypes from 'prop-types';
import { isAddress } from 'web3-utils';
import idx from 'idx';
// Context
import { useAdminData } from '../../context/adminData';
// Utils
import useTab from './useTab';
import { errorToast } from '../../util/tabTools';
// Components
import AdminTab from '../../components/AdminTab/AdminTab';
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

type AdminTabContainerProps = {
  isOpen: boolean;
};

type Admin = {
  address: string;
  identifier: string;
  status: string;
};

const AdminTabContainer: React.FC<AdminTabContainerProps> = ({ isOpen }) => {
  const { admins, isAdmin, userAddress, dataReady, adminContract } = useAdminData();
  const { list, modals, toggleModal, addTransaction, updateTransaction, deleteTransaction, openToast } = useTab(
    admins || [],
    (identifier: string) => ({ address: identifier })
  );

  const handleAdd = async (value: string) => {
    try {
      const tx = await adminContract!.functions.addAdmin(value);
      toggleModal('add')();
      addTransaction(value, PENDING_ADDITION);
      const receipt = await tx.wait(1); // wait on receipt confirmations
      const addEvent = receipt.events!.filter(e => e.event && e.event === 'AdminAdded').pop();
      if (!addEvent) {
        openToast(value, FAIL, `Error while processing Admin account: ${value}`);
      } else {
        const addSuccessResult = idx(addEvent, _ => _.args[0]);
        if (addSuccessResult === undefined) {
          openToast(value, FAIL, `Error while processing Admin account: ${value}`);
        } else if (Boolean(addSuccessResult)) {
          openToast(value, SUCCESS, `New Admin account processed: ${value}`);
        } else {
          const message = idx(addEvent, _ => _.args[2]);
          openToast(value, FAIL, message);
        }
      }
      deleteTransaction(value);
    } catch (e) {
      toggleModal('add')(false);
      updateTransaction(value, FAIL_ADDITION);
      errorToast(e, value, openToast, () =>
        openToast(value, FAIL, 'Could not add account as admin', `${value} was unable to be added. Please try again.`)
      );
    }
  };

  const handleRemove = async (value: string) => {
    try {
      const est = await adminContract!.estimate.removeAdmin(value);
      const tx = await adminContract!.functions.removeAdmin(value, { gasLimit: est.toNumber() * 2 });
      toggleModal('remove')();
      addTransaction(value, PENDING_REMOVAL);
      await tx.wait(1); // wait on receipt confirmations
      openToast(value, SUCCESS, `Removal of admin account processed: ${value}`);
      deleteTransaction(value);
    } catch (e) {
      toggleModal('remove')();
      updateTransaction(value, FAIL_REMOVAL);
      errorToast(e, value, openToast, () =>
        openToast(value, FAIL, 'Could not remove admin account', `${value} was unable to be removed. Please try again.`)
      );
    }
  };

  const isValidAdmin = (address: string) => {
    let isValidAddress = isAddress(address);
    if (!isValidAddress) {
      return {
        valid: false
      };
    }

    let isAdmin = list.filter((item: Admin) => item.address === address).length > 0;
    if (isAdmin) {
      return {
        valid: false,
        msg: 'Account address is already an admin.'
      };
    }

    return {
      valid: true
    };
  };

  if (isOpen && dataReady) {
    return (
      <AdminTab
        list={list}
        userAddress={userAddress}
        modals={modals}
        toggleModal={toggleModal}
        handleAdd={handleAdd}
        handleRemove={handleRemove}
        isAdmin={isAdmin}
        deleteTransaction={deleteTransaction}
        isValid={isValidAdmin}
        isOpen={isOpen}
      />
    );
  } else if (isOpen && !dataReady) {
    return <LoadingPage />;
  } else {
    return <div />;
  }
};

AdminTabContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired
};

export default AdminTabContainer;
