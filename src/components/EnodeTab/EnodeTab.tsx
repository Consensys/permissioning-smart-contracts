// Libs
import React, { Fragment } from 'react';
import PropTypes from 'prop-types'; // Components
import EnodeTable from './Table';
import AddModal from '../../containers/Modals/AddNode';
import RemoveModal from '../../containers/Modals/Remove';
// Constants
import { addEnodeDisplay, removeEnodeDisplay } from '../../constants/modals';
import { Enode, EnodeTransaction } from '../../util/enodetools';

type EnodeTab = {
  list: (Enode & { identifier: string; status: string })[];
  listTransaction: (EnodeTransaction & { identifier: string; status: string })[];
  modals: {
    add: boolean;
    remove: string;
    lock: boolean;
  };
  toggleModal: (name: 'add' | 'remove' | 'lock') => (value?: boolean | string) => void;
  handleAdd: (enode:string,nodeType:string, nodeName:string,nodeOrganization:string,nodeGeoHash:string , nodeDid:string) => Promise<void>;
  handleRemove: (value: any) => Promise<void>;
  handleConfirm:(value: any) => Promise<void>;
  handleRevoke:(value: any) => Promise<void>;
  isAdmin: boolean;
  deleteTransaction: (identifier: string) => void;
  isValid: (address: string) => { valid: boolean };
  isOpen: boolean;
  isReadOnly: boolean;
  modifySelectType: (input: { target: { value: string } }) => void;
  selectTypeSearch : string;
  modifyInputSearchOrganization: (input: { target: { value: string } }) => void;
  inputSearchOrganization : string;
  handleSearch: (e: MouseEvent) => void;
  handleClear: (e: MouseEvent) => void;
};

const EnodeTab: React.FC<EnodeTab> = ({
  inputSearchOrganization,
  modifyInputSearchOrganization,
  modifySelectType,
  selectTypeSearch,
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
  isReadOnly,
  deleteTransaction,
  isValid,
  isOpen
}) => (
  <Fragment>
    {isOpen && (
      <Fragment>
        <EnodeTable
        inputSearchOrganization={inputSearchOrganization}
        modifyInputSearchOrganization={modifyInputSearchOrganization}
         modifySelectType={modifySelectType}
         selectTypeSearch={selectTypeSearch}
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
