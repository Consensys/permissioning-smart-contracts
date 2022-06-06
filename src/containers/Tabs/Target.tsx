// Libs
import React ,{useState,useMemo} from 'react';
import PropTypes from 'prop-types';
import { isAddress } from 'web3-utils';
import idx from 'idx';
// Context
import { useTargetData } from '../../context/targetData';
import { useAdminData } from '../../context/adminData';
// Utils
import useTab from './useTab';
import useTransactionTab from './useTransactionTab';
import { errorToast } from '../../util/tabTools';
// Components
import TargetTab from '../../components/TargetTab/TargetTab';
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

type AccountTabContainerProps = {
  isOpen: boolean;
};

type Account = {
  address: string;
  // isAccount:boolean;
  // executed: boolean;
  identifier: string;
  status: string;
};

const AccountTabContainer: React.FC<AccountTabContainerProps> = ({ isOpen }) => {
  const [inputSearch, setInputSearch] = useState('');
  const [search, setSearch] = useState("")
  
  const modifyInputSearch = ({ target: { value } }: { target: { value: string } }) => {
   
    setInputSearch(value);
   
  };
  
  const handleSearch = (e: MouseEvent) => {
    e.preventDefault();
    setSearch(inputSearch)
  };
  
  const handleClear = (e: MouseEvent) => {
    e.preventDefault();
    setSearch("")
    setInputSearch("")
  };

  const { isAdmin, dataReady: adminDataReady } = useAdminData();
  const { allowlist, allowTransactionlist, isReadOnly, dataReady, accountRulesContract } = useTargetData();

  const { list, modals, toggleModal, addTransaction, updateTransaction, deleteTransaction, openToast } = useTab(
    allowlist,
    (identifier: string) => ({ address: identifier })
  );

  const listFilter=useMemo(()=>  list.filter(row=> {
   
    return row.address.toUpperCase().includes(search.toUpperCase());
  }
  ),[search,list])

  const { listTransaction} = useTransactionTab(
    allowTransactionlist,
    (identifier: string) => ({ address: identifier })
  );

  if (!!accountRulesContract) {
    const handleAdd = async (value: string) => {

      try {
        const est = await accountRulesContract!.estimate.addTarget(value ,{ gasLimit:  300000 });
        const tx = await accountRulesContract!.functions.addTarget(value ,{ gasLimit: est.toNumber() + 300000 });
        toggleModal('add')(false);
        addTransaction(value, PENDING_ADDITION);
        const receipt = await tx.wait(1); // wait on receipt confirmations
        const addEvent = receipt.events!.filter(e => e.event && e.event === 'TargetAdded').pop();
        if (!addEvent) {
          openToast(value, FAIL, `Error while processing target: ${value}`);
        } else {
          const addSuccessResult = idx(addEvent, _ => _.args[0]);
          if (addSuccessResult === undefined) {
            openToast(value, FAIL, `Error while adding target: ${value}`);
          } else if (Boolean(addSuccessResult)) {
            openToast(value, SUCCESS, `New target added: ${value}`);
          } else {
            openToast(value, FAIL, `Target "${value}" is already added`);
          }
        }
        deleteTransaction(value);
      } catch (e) {
        console.log(e)
        toggleModal('add')(false);
        updateTransaction(value, FAIL_ADDITION);
        errorToast(e, value, openToast, () =>
          openToast(value, FAIL, 'Could not add target', `${value} was unable to be added. Please try again.`)
        );
      }
    };

    const handleRemove = async (value: string) => {
      try {
        const est = await accountRulesContract!.estimate.removeTarget(value ,{ gasLimit:  300000 });
        const tx = await accountRulesContract!.functions.removeTarget(value, { gasLimit: est.toNumber() + 300000 });
        toggleModal('remove')(false);
        addTransaction(value, PENDING_REMOVAL);
        await tx.wait(1); // wait on receipt confirmations
        openToast(value, SUCCESS, `Removal of target processed: ${value}`);
        deleteTransaction(value);
      } catch (e) {
        console.log('error', e);
        toggleModal('remove')(false);
        updateTransaction(value, FAIL_REMOVAL);
        errorToast(e, value, openToast, () =>
          openToast(value, FAIL, 'Could not remove target', `${value} was unable to be removed. Please try again.`)
        );
      }
    };
    const handleConfirm = async (value: number) => {
      try {
        const est = await accountRulesContract!.estimate.confirmTransaction(value ,{ gasLimit:  300000 });
        const tx = await accountRulesContract!.functions.confirmTransaction(value, { gasLimit: est.toNumber() + 300000 });
        //toggleModal('add')(false);
        addTransaction(value.toString(), PENDING_CONFIRM);
        await tx.wait(1); // wait on receipt confirmations
        openToast(value.toString(), SUCCESS, `Confirm of target processed: ${value}`);
        deleteTransaction(value.toString());
      } catch (e) {
        console.log('error', e);
       // toggleModal('add')(false);
        updateTransaction(value.toString(), FAIL_CONFIRM);
        errorToast(e, value.toString(), openToast, () =>
          openToast(value.toString(), FAIL, 'Could not Confirm target', `${value} was unable to be Confirmend. Please try again.`)
        );
      }
    };

    const handleRevoke= async (value: number) => {
      try {
        const est = await accountRulesContract!.estimate.revokeConfirmation(value ,{ gasLimit:  300000 });
        const tx = await accountRulesContract!.functions.revokeConfirmation(value, { gasLimit: est.toNumber() + 300000 });
       // toggleModal('remove')(false);
        addTransaction(value.toString(), PENDING_REVOKE);
        await tx.wait(1); // wait on receipt confirmations
        openToast(value.toString(), SUCCESS, `Revoke of target processed: ${value}`);
        deleteTransaction(value.toString());
      } catch (e) {
        console.log('error', e);
        //toggleModal('remove')(false);
        updateTransaction(value.toString(), FAIL_REVOKE);
        errorToast(e, value.toString(), openToast, () =>
          openToast(value.toString(), FAIL, 'Could not Revoke target', `${value} was unable to be Revoked. Please try again.`)
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
          msg: 'Target address is already added.'
        };
      }

      return {
        valid: true
      };
    };

    const allDataReady: boolean = dataReady && adminDataReady;
    if (isOpen && allDataReady) {
      return (
        <TargetTab
        modifyInputSearch={modifyInputSearch}
        inputSearch={inputSearch}
        handleSearch={handleSearch}
        handleClear={handleClear}
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
    return <NoContract tabName="Target Rules" />;
  } else {
    return <div />;
  }
};

AccountTabContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired
};

export default AccountTabContainer;
