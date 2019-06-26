// Libs
import React, { Fragment } from "react";
import PropTypes from "prop-types";
// Components
import AccountTable from "./Table";
import AddModal from "../../containers/Modals/Add";
import RemoveModal from "../../containers/Modals/Remove";
// Constants
import {
    addAccountDisplay,
    removeAccountDisplay
} from "../../constants/modals";

type AccountTab = {
  list: any[],
  userAddress?: string,
  modals: {
    add: boolean | object,
    remove: boolean | string,
    lock: boolean
  },
  toggleModal: (name: "add"|"remove"|"lock") => (value?: boolean | string) => void,
  handleAdd: (value: any) => Promise<void>,
  handleRemove: (value: any) => Promise<void>,
  isAdmin: boolean,
  deleteTransaction: () => void,
  isValid: (address: string) => object,
  isOpen: boolean,
  isReadOnly: boolean,
  pendingLock: boolean
};

const AccountTab: React.FC<AccountTab> = ({
    list,
    userAddress,
    modals,
    toggleModal,
    handleAdd,
    handleRemove,
    isAdmin,
    deleteTransaction,
    isValid,
    isOpen,
    isReadOnly,
    pendingLock
}) => (
    <Fragment>
        {isOpen && (
            <Fragment>
                <AccountTable
                    list={list}
                    userAddress={userAddress!}
                    toggleModal={toggleModal}
                    isAdmin={isAdmin}
                    deleteTransaction={deleteTransaction}
                    pendingLock={pendingLock}
                    isReadOnly={isReadOnly}
                />
                <AddModal
                    isOpen={Boolean(modals.add) && isAdmin}
                    closeModal={toggleModal("add")}
                    handleAdd={handleAdd}
                    display={addAccountDisplay}
                    isValid={isValid}
                />
                <RemoveModal
                    isOpen={Boolean(modals.remove) && isAdmin}
                    value={modals.remove}
                    closeModal={toggleModal("remove")}
                    handleRemove={handleRemove}
                    display={removeAccountDisplay(modals.remove)}
                />
            </Fragment>
        )}
    </Fragment>
);

AccountTab.propTypes = {
    list: PropTypes.array.isRequired,
    userAddress: PropTypes.string,
    modals: PropTypes.shape({
      add: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired,
      remove: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
      lock: PropTypes.bool.isRequired
    }).isRequired,
    toggleModal: PropTypes.func.isRequired,
    handleAdd: PropTypes.func.isRequired,
    handleRemove: PropTypes.func.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    deleteTransaction: PropTypes.func.isRequired,
    isValid: PropTypes.func.isRequired,
    pendingLock: PropTypes.bool.isRequired,
    isReadOnly: PropTypes.bool.isRequired
};

export default AccountTab;
