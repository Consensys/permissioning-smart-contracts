// Libs
import React from 'react';
import PropTypes from 'prop-types';
import { isAddress } from 'web3-utils';
import idx from 'idx';
// Context
import { useAdminData } from '../../context/adminData';
// Utils
import useTab from './useTab';
import useTransactionTab from './useTransactionTab';
import { errorToast } from '../../util/tabTools';
// Components
import AdminTab from '../../components/AdminTab/AdminTab';
import LoadingPage from '../../components/LoadingPage/LoadingPage';
import NoContract from '../../components/Flashes/NoContract';
// Constants
import {
  PENDING_ADDITION,
  FAIL_ADDITION,
  PENDING_REMOVAL,
  FAIL_REMOVAL,
  PENDING_CONFIRM,
  FAIL_CONFIRM,
  PENDING_REVOKE,
  FAIL_REVOKE,
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
  const { admins, isAdmin, userAddress, dataReady, adminContract, allowTransactionlist } = useAdminData();
  const { list, modals, toggleModal, addTransaction, updateTransaction, deleteTransaction, openToast } = useTab(
    admins || [],
    (identifier: string) => ({ address: identifier })
  );

  const { listTransaction } = useTransactionTab(allowTransactionlist, (identifier: string) => ({
    address: identifier
  }));

  if (!!adminContract) {
    const handleAdd = async (value: string) => {
      try {
        const est = await adminContract!.estimate.addAdmin(value ,  {
          gasLimit:  300000
        });
        const tx = await adminContract!.functions.addAdmin(value  , { gasLimit: est.toNumber() +  300000});
        toggleModal('add')(false);
        addTransaction(value, PENDING_ADDITION);
        const receipt = await tx.wait(1); // wait on receipt confirmations
       // console.log(receipt.events)//Confirmation
        const addEvent = receipt.events!.filter(e => e.event && e.event === 'Confirmation').pop();
        if (!addEvent) {
          openToast(value, FAIL, `Error while processing Admin account: ${value}`);
        } else {
          const addSuccessResult = idx(addEvent, _ => _.args[0]);
          console.log()
          if (addSuccessResult === undefined) {
            openToast(value, FAIL, `Error while processing Admin account: ${value}`);
          } else { //if (Boolean(addSuccessResult)) {
            openToast(value, SUCCESS, `New Admin account processed: ${value}`);
          }
          // } else {
          //   const message = idx(addEvent, _ => _.args[2]);
          //   openToast(value, FAIL, message);
          // }
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
        const est = await adminContract!.estimate.removeAdmin(value ,  {
          gasLimit:  300000
        });
        const tx = await adminContract!.functions.removeAdmin(value, { gasLimit: est.toNumber() + 300000 });
        toggleModal('remove')(false);
        addTransaction(value, PENDING_REMOVAL);
        await tx.wait(1); // wait on receipt confirmations
        openToast(value, SUCCESS, `Removal of admin account processed: ${value}`);
        deleteTransaction(value);
      } catch (e) {
        toggleModal('remove')(false);
        updateTransaction(value, FAIL_REMOVAL);
        errorToast(e, value, openToast, () =>
          openToast(
            value,
            FAIL,
            'Could not remove admin account',
            `${value} was unable to be removed. Please try again.`
          )
        );
      }
    };

    const handleConfirm = async (value: number) => {
      try {
        const est = await adminContract!.estimate.confirmTransaction(value , {
          gasLimit:  300000
        });
        const tx = await adminContract!.functions.confirmTransaction(value, { gasLimit: est.toNumber() + 300000 });
        //toggleModal('add')(false);
        addTransaction(value.toString(), PENDING_CONFIRM);
        await tx.wait(1); // wait on receipt confirmations
        openToast(value.toString(), SUCCESS, `Confirm of account processed: ${value}`);
        deleteTransaction(value.toString());
      } catch (e) {
        console.log('error', e);
        // toggleModal('add')(false);
        updateTransaction(value.toString(), FAIL_CONFIRM);
        errorToast(e, value.toString(), openToast, () =>
          openToast(
            value.toString(),
            FAIL,
            'Could not Confirm account',
            `${value} was unable to be Confirmend. Please try again.`
          )
        );
      }
    };

    const handleRevoke = async (value: number) => {
      try {
        const est = await adminContract!.estimate.revokeConfirmation(value);
        const tx = await adminContract!.functions.revokeConfirmation(value, { gasLimit: est.toNumber() + 300000 });
        // toggleModal('remove')(false);
        addTransaction(value.toString(), PENDING_REVOKE);
        await tx.wait(1); // wait on receipt confirmations
        openToast(value.toString(), SUCCESS, `Revoke of account processed: ${value}`);
        deleteTransaction(value.toString());
      } catch (e) {
        console.log('error', e);
        //toggleModal('remove')(false);
        updateTransaction(value.toString(), FAIL_REVOKE);
        errorToast(e, value.toString(), openToast, () =>
          openToast(
            value.toString(),
            FAIL,
            'Could not Revoke account',
            `${value} was unable to be Revoked. Please try again.`
          )
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

      let isAdmin = list.filter((item: Admin) => item.address.toLowerCase() === address.toLowerCase()).length > 0;
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
          listTransaction={listTransaction}
          userAddress={userAddress}
          modals={modals}
          toggleModal={toggleModal}
          handleAdd={handleAdd}
          handleRemove={handleRemove}
          handleConfirm={handleConfirm}
          handleRevoke={handleRevoke}
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
  } else if (isOpen && !adminContract) {
    return <NoContract tabName="Admin" />;
  } else {
    return <div />;
  }
};

AdminTabContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired
};

export default AdminTabContainer;
