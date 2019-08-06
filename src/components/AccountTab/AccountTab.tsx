// Libs
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
// Components
import AccountTable from './Table';
import AddModal from '../../containers/Modals/Add';
import RemoveModal from '../../containers/Modals/Remove';
// Constants
import { addAccountDisplay, removeAccountDisplay } from '../../constants/modals';

type AccountTab = {
  list: any[];
  modals: {
    add: boolean;
    remove: boolean | string;
    lock: boolean;
  };
  toggleModal: (name: 'add' | 'remove' | 'lock') => (value?: boolean | string) => void;
  handleAdd: (value: any) => Promise<void>;
  handleRemove: (value: any) => Promise<void>;
  isAdmin: boolean;
  deleteTransaction: (identifier: string) => void;
  isValid: (address: string) => { valid: boolean };
  isOpen: boolean;
  isReadOnly: boolean;
};

const AccountTab: React.FC<AccountTab> = ({
  list,
  modals,
  toggleModal,
  handleAdd,
  handleRemove,
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
          list={list}
          toggleModal={toggleModal}
          isAdmin={isAdmin}
          deleteTransaction={deleteTransaction}
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
  isAdmin: PropTypes.bool.isRequired,
  deleteTransaction: PropTypes.func.isRequired,
  isValid: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool.isRequired
};

export default AccountTab;
