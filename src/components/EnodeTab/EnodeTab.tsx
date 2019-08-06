// Libs
import React, { Fragment } from 'react';
import PropTypes from 'prop-types'; // Components
import EnodeTable from './Table';
import AddModal from '../../containers/Modals/Add';
import RemoveModal from '../../containers/Modals/Remove';
// Constants
import { addEnodeDisplay, removeEnodeDisplay } from '../../constants/modals';
import { Enode } from '../../util/enodetools';

type EnodeTab = {
  list: (Enode & { identifier: string; status: string })[];
  modals: {
    add: boolean;
    remove: string;
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

const EnodeTab: React.FC<EnodeTab> = ({
  list,
  modals,
  toggleModal,
  handleAdd,
  handleRemove,
  isAdmin,
  isReadOnly,
  deleteTransaction,
  isValid,
  isOpen
}) => (
  <Fragment>
    {isOpen && (
      <Fragment>
        <EnodeTable
          list={list}
          toggleModal={toggleModal}
          isAdmin={isAdmin}
          deleteTransaction={deleteTransaction}
          isReadOnly={isReadOnly}
        />
        <AddModal
          isOpen={modals.add && isAdmin && !isReadOnly}
          closeModal={() => toggleModal('add')(false)}
          handleAdd={handleAdd}
          display={addEnodeDisplay}
          isValid={isValid}
        />
        <RemoveModal
          isOpen={Boolean(modals.remove) && isAdmin && !isReadOnly}
          value={modals.remove}
          closeModal={() => toggleModal('remove')(false)}
          handleRemove={handleRemove}
          display={removeEnodeDisplay(modals.remove)}
        />
      </Fragment>
    )}
  </Fragment>
);

EnodeTab.propTypes = {
  list: PropTypes.array.isRequired,
  modals: PropTypes.shape({
    add: PropTypes.bool.isRequired,
    remove: PropTypes.oneOfType([PropTypes.string]).isRequired,
    lock: PropTypes.bool.isRequired
  }).isRequired,
  toggleModal: PropTypes.func.isRequired,
  handleAdd: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  deleteTransaction: PropTypes.func.isRequired,
  isValid: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired
};

export default EnodeTab;
