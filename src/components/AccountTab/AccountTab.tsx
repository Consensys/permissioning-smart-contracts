// Libs
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
// Components
import AccountTable from './Table';
import AddModal from '../../containers/Modals/AddAccount';
import RemoveModal from '../../containers/Modals/Remove';
// Constants
import { addAccountDisplay, removeAccountDisplay } from '../../constants/modals';

type AccountTab = {
  list: any[];
  listTransaction:any[];
  modals: {
    add: boolean;
    remove: boolean | string;
    lock: boolean;
  };
  toggleModal: (name: 'add' | 'remove' | 'lock') => (value?: boolean | string) => void;
  handleAdd: (value: any ,membresiaType:string) => Promise<void>;
  handleRemove: (value: any) => Promise<void>;
  handleConfirm:(value: any) => Promise<void>;
  handleRevoke:(value: any) => Promise<void>;
  isAdmin: boolean;
  deleteTransaction: (identifier: string) => void;
  isValid: (address: string) => { valid: boolean };
  isOpen: boolean;
  isReadOnly: boolean;
  modifyInputSearch: (input: { target: { value: string } }) => void;
  inputSearch : string;
  handleSearch: (e: MouseEvent) => void;
  handleClear: (e: MouseEvent) => void;
};

const AccountTab: React.FC<AccountTab> = ({
  modifyInputSearch,
  inputSearch,
  handleSearch,
  handleClear,
  list,
  listTransaction,
  modals,
  toggleModal,
  handleAdd,
  handleRemove,
  handleConfirm,
  handleRevoke,
  isAdmin,
  deleteTransaction,
  isValid,
  isOpen,
  isReadOnly
}) => (
  <Fragment>
    {isOpen && (
      <Fragment>
        <AccountTable

        modifyInputSearch={modifyInputSearch}
        inputSearch={inputSearch}
        handleSearch={handleSearch}
        handleClear={handleClear}
          list={list}
          listTransaction={listTransaction}
          toggleModal={toggleModal}
          isAdmin={isAdmin}
          deleteTransaction={deleteTransaction}
          handleConfirm={handleConfirm}
          handleRevoke={handleRevoke}
          isReadOnly={isReadOnly}
        />
        <AddModal
          isOpen={Boolean(modals.add) && isAdmin}
          closeModal={() => toggleModal('add')(false)}
          handleAdd={handleAdd}
          display={addAccountDisplay}
          isValid={isValid}
        />
        <RemoveModal
          isOpen={Boolean(modals.remove) && isAdmin}
          value={modals.remove}
          closeModal={() => toggleModal('remove')(false)}
          handleRemove={handleRemove}
          display={removeAccountDisplay(modals.remove)}
        />
      </Fragment>
    )}
  </Fragment>
);

AccountTab.propTypes = {
  list: PropTypes.array.isRequired,
  modals: PropTypes.shape({
    add: PropTypes.bool.isRequired,
    remove: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
    lock: PropTypes.bool.isRequired
  }).isRequired,
  toggleModal: PropTypes.func.isRequired,
  handleAdd: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  handleRevoke: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  deleteTransaction: PropTypes.func.isRequired,
  isValid: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool.isRequired
};

export default AccountTab;
