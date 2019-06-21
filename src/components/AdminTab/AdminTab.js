// Libs
import React, { Fragment } from "react";
import PropTypes from "prop-types";
// Components
import AdminTable from "./Table";
import AddModal from "../../containers/Modals/Add";
import RemoveModal from "../../containers/Modals/Remove";
// Constants
import { addAdminDisplay, removeAdminDisplay } from "../../constants/modals";

const AdminTab = ({
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
                <AdminTable
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
                    display={addAdminDisplay}
                    isValid={isValid}
                />
                <RemoveModal
                    isOpen={modals.remove && isAdmin}
                    value={modals.remove}
                    closeModal={toggleModal("remove")}
                    handleRemove={handleRemove}
                    display={removeAdminDisplay(modals.remove)}
                />
            </Fragment>
        )}
    </Fragment>
);

AdminTab.propTypes = {
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

export default AdminTab;
