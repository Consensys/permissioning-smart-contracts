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
import NoContract from '../../components/Flashes/NoContract';
// Constants
import {
  PENDING_ADDITION,
  FAIL_ADDITION,
  PENDING_REMOVAL,
  FAIL_REMOVAL,
  PENDING_MODIFY,
  FAIL_MODIFY,
  SUCCESS,
  FAIL
} from '../../constants/transactions';
import AccountWithPermissions from '../../components/AccountTab/AccountWithPermissions';

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
  const { allowlist, isReadOnly, dataReady, accountRulesContract } = useAccountData();

  const { list, modals, toggleModal, addTransaction, updateTransaction, deleteTransaction, openToast } = useTab(
    allowlist,
    (identifier: string) => ({ address: identifier })
  );

  if (!!accountRulesContract) {
    const handleAdd = async (value: string) => {
      try {
        const tx = await accountRulesContract!.functions.addAccount(value);
        toggleModal('add')(false);
        addTransaction(value, PENDING_ADDITION);
        const receipt = await tx.wait(1); // wait on receipt confirmations
        const addEvent = receipt.events!.filter(e => e.event && e.event === 'AccountAdded').pop();
        if (!addEvent) {
          openToast(value, FAIL, `Error while processing account: ${value}`);
        } else {
          const addSuccessResult = idx(addEvent, _ => _.args[0]);
          if (addSuccessResult === undefined) {
            openToast(value, FAIL, `Error while adding account: ${value}`);
          } else if (Boolean(addSuccessResult)) {
            openToast(value, SUCCESS, `New account added: ${value}`);
          } else {
            openToast(value, FAIL, `Account "${value}" is already added`);
          }
        }
        deleteTransaction(value);
      } catch (e) {
        toggleModal('add')(false);
        updateTransaction(value, FAIL_ADDITION);
        errorToast(e, value, openToast, () =>
          openToast(value, FAIL, 'Could not add account', `${value} was unable to be added. Please try again.`)
        );
      }
    };

    const handleRemove = async (value: string) => {
      try {
        const est = await accountRulesContract!.estimate.removeAccount(value);
        const tx = await accountRulesContract!.functions.removeAccount(value, { gasLimit: est.toNumber() * 2 });
        toggleModal('remove')(false);
        addTransaction(value, PENDING_REMOVAL);
        await tx.wait(1); // wait on receipt confirmations
        openToast(value, SUCCESS, `Modify of account processed: ${value}`);
        deleteTransaction(value);
      } catch (e) {
        console.log('error', e);
        toggleModal('remove')(false);
        updateTransaction(value, FAIL_REMOVAL);
        errorToast(e, value, openToast, () =>
          openToast(value, FAIL, 'Could not remove account', `${value} was unable to be removed. Please try again.`)
        );
      }
    };

    const handleModify = async (account: AccountWithPermissions) => {
      var value = account.address;
      try {
        console.log('handleModify (' + value + ' ' + account.canCreateContracts + ')');
        const est = await accountRulesContract!.estimate.setCreateContractPermission(value, account.canCreateContracts);
        const tx = await accountRulesContract!.functions.setCreateContractPermission(
          value,
          account.canCreateContracts,
          {
            gasLimit: est.toNumber() * 2
          }
        );
        toggleModal('modify')(false);
        addTransaction(value, PENDING_MODIFY);
        await tx.wait(1); // wait on receipt confirmations
        openToast(value, SUCCESS, `Modify permissions of account processed: ${value}`);
        deleteTransaction(value);
      } catch (e) {
        console.log('error', e);
        toggleModal('modify')(false);
        updateTransaction(value, FAIL_MODIFY);
        errorToast(e, value, openToast, () =>
          openToast(value, FAIL, 'Could not modify permissions for account', `${value}. Please try again.`)
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

      let isDuplicateAccount =
        list.filter((item: Account) => address.toLowerCase() === item.address.toLowerCase()).length > 0;
      if (isDuplicateAccount) {
        return {
          valid: false,
          msg: 'Account address is already added.'
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
          handleModify={handleModify}
          isAdmin={isAdmin}
          deleteTransaction={deleteTransaction}
          isValid={isValidAccount}
          isOpen={isOpen}
          isReadOnly={isReadOnly!}
        />
      );
    } else if (isOpen && !allDataReady) {
      return <LoadingPage />;
    } else {
      return <div />;
    }
  } else if (isOpen && !accountRulesContract) {
    return <NoContract tabName="Account Rules" />;
  } else {
    return <div />;
  }
};

AccountTabContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired
};

export default AccountTabContainer;
