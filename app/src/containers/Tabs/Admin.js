// Libs
import React from "react";
import PropTypes from "prop-types";
import { drizzleReactHooks } from "drizzle-react";
import { isAddress } from "web3-utils";
// Context
import { useData } from "../../context/data";
// Utils
import useTab from "./useTab";
// Components
import AdminTab from "../../components/AdminTab/AdminTab";

const AdminTabContainer = ({ isOpen }) => {
    const { admins, isAdmin, userAddress } = useData();

    const {
        list,
        modals,
        toggleModal,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        toasts,
        openToast,
        closeToast
    } = useTab(admins, identifier => ({ address: identifier }));

    const { drizzle } = drizzleReactHooks.useDrizzle();

    const { addAdmin, removeAdmin } = drizzle.contracts.Admin.methods;

    const handleAdd = async value => {
        const gasLimit = await addAdmin(value).estimateGas({
            from: userAddress
        });
        addAdmin(value)
            .send({ from: userAddress, gasLimit: gasLimit * 4 })
            .on("transactionHash", () => {
                toggleModal("add")();
                addTransaction(value, "pendingAddition");
            })
            .on("receipt", () => {
                openToast(
                    value,
                    "success",
                    `New admin account processed: ${value}`
                );
            })
            .on("error", () => {
                toggleModal("add")();
                updateTransaction(value, "failAddition");
                openToast(
                    value,
                    "fail",
                    "Could not add acount as admin",
                    `${value} was unable to be added. Please try again.`
                );
            });
    };

    const handleRemove = async value => {
        const gasLimit = await removeAdmin(value).estimateGas({
            from: userAddress
        });
        removeAdmin(value)
            .send({ from: userAddress, gasLimit: gasLimit * 4 })
            .on("transactionHash", () => {
                toggleModal("remove")();
                addTransaction(value, "pendingRemoval");
            })
            .on("receipt", () => {
                openToast(
                    value,
                    "success",
                    `Removal of admin account processed: ${value}`
                );
            })
            .on("error", () => {
                toggleModal("remove")();
                updateTransaction(value, "failRemoval");
                openToast(
                    value,
                    "fail",
                    "Could not remove admin account",
                    `${value} was unable to be removed. Please try again.`
                );
            });
    };

    return (
        <AdminTab
            list={list}
            toasts={toasts}
            closeToast={closeToast}
            userAddress={userAddress}
            modals={modals}
            toggleModal={toggleModal}
            handleAdd={handleAdd}
            handleRemove={handleRemove}
            isAdmin={isAdmin}
            deleteTransaction={deleteTransaction}
            isValid={isAddress}
            isOpen={isOpen}
        />
    );
};

AdminTabContainer.propTypes = {
    isOpen: PropTypes.bool.isRequired
};

export default AdminTabContainer;
