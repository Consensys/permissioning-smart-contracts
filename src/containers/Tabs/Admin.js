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
// Constants
import {
    PENDING_ADDITION,
    FAIL_ADDITION,
    PENDING_REMOVAL,
    FAIL_REMOVAL,
    SUCCESS,
    FAIL
} from "../../constants/transactions";

const AdminTabContainer = ({ isOpen }) => {
    const { admins, isAdmin, userAddress } = useData();

    const {
        list,
        modals,
        toggleModal,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        openToast
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
                addTransaction(value, PENDING_ADDITION);
            })
            .on("receipt", () => {
                openToast(
                    value,
                    SUCCESS,
                    `New admin account processed: ${value}`
                );
            })
            .on("error", () => {
                toggleModal("add")();
                updateTransaction(value, FAIL_ADDITION);
                openToast(
                    value,
                    FAIL,
                    "Could not add account as admin",
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
                addTransaction(value, PENDING_REMOVAL);
            })
            .on("receipt", () => {
                openToast(
                    value,
                    SUCCESS,
                    `Removal of admin account processed: ${value}`
                );
            })
            .on("error", () => {
                toggleModal("remove")();
                updateTransaction(value, FAIL_REMOVAL);
                openToast(
                    value,
                    FAIL,
                    "Could not remove admin account",
                    `${value} was unable to be removed. Please try again.`
                );
            });
    };

    return (
        <AdminTab
            list={list}
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
