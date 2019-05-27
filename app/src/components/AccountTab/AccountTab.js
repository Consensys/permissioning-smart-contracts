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

const AccountTab = ({
    list,
    userAddress,
    modals,
    toggleModal,
    handleAdd,
    handleRemove,
    isAdmin,
    deleteTransaction,
    isValid,
    isOpen
}) => (
    <Fragment>
        {isOpen && (
            <Fragment>
                <AccountTable
                    list={list}
                    userAddress={userAddress}
                    toggleModal={toggleModal}
                    isAdmin={isAdmin}
                    deleteTransaction={deleteTransaction}
                />
                <AddModal
                    isOpen={modals.add && isAdmin}
                    closeModal={toggleModal("add")}
                    handleAdd={handleAdd}
                    display={addAccountDisplay}
                    isValid={isValid}
                />
                <RemoveModal
                    isOpen={modals.remove && isAdmin}
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
    list: PropTypes.arrayOf(PropTypes.object).isRequired,
    userAddress: PropTypes.string,
    modals: PropTypes.object.isRequired,
    toggleModal: PropTypes.func.isRequired,
    handleAdd: PropTypes.func.isRequired,
    handleRemove: PropTypes.func.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    deleteTransaction: PropTypes.func.isRequired,
    isValid: PropTypes.func.isRequired
};

export default AccountTab;
