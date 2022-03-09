// Libs
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
// Components
import AdminTable from './Table';
import AddModal from '../../containers/Modals/Add';
import RemoveModal from '../../containers/Modals/Remove';
// Constants
import { addAdminDisplay, removeAdminDisplay } from '../../constants/modals';

type AdminTab = {
  list: { address: string; status: string }[];
  listTransaction: any[];
  userAddress?: string;
  modals: {
    add: boolean;
    remove: boolean | string;
    lock: boolean;
  };
  toggleModal: (name: 'add' | 'remove' | 'lock') => (value?: boolean | string) => void;
  handleAdd: (value: any) => Promise<void>;
  handleRemove: (value: any) => Promise<void>;
  handleConfirm: (value: any) => Promise<void>;
  handleRevoke: (value: any) => Promise<void>;
  isAdmin: boolean;
  deleteTransaction: (identifier: string) => void;
  isValid: (address: string) => { valid: boolean; msg?: string };
  isOpen: boolean;
};

const AdminTab: React.FC<AdminTab> = ({
  list,
  listTransaction,
  userAddress,
  modals,
  toggleModal,
  handleAdd,
  handleRemove,
  handleConfirm,
  handleRevoke,
  isAdmin,
  deleteTransaction,
  isValid,
  isOpen
}) => (
  <Fragment>
    {isOpen && (
      <Fragment>
        <AdminTable
          list={list}
          listTransaction={listTransaction}
          userAddress={userAddress}
          toggleModal={toggleModal}
          isAdmin={isAdmin}
          deleteTransaction={deleteTransaction}
          handleConfirm={handleConfirm}
          handleRevoke={handleRevoke}
        />
        <AddModal
          isOpen={modals.add && isAdmin}
          closeModal={() => toggleModal('add')(false)}
          handleAdd={handleAdd}
          display={addAdminDisplay}
          isValid={isValid}
        />
        <RemoveModal
          isOpen={Boolean(modals.remove) && isAdmin}
          value={modals.remove}
          closeModal={() => toggleModal('remove')(false)}
          handleRemove={handleRemove}
          display={removeAdminDisplay(modals.remove)}
        />
      </Fragment>
    )}
  </Fragment>
);

AdminTab.propTypes = {
  list: PropTypes.array.isRequired,
  userAddress: PropTypes.string,
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
  isValid: PropTypes.func.isRequired
};

export default AdminTab;
