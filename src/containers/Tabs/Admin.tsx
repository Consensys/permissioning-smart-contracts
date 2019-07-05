// Libs
import React from "react";
import PropTypes from "prop-types";
import { drizzleReactHooks } from "drizzle-react";
import { isAddress } from "web3-utils";
import idx from "idx";
import { TransactionObject } from "web3/eth/types";
// Context
import { useAdminData } from "../../context/adminData";
// Utils
import useTab from "./useTab";
import { errorToast } from "../../util/tabTools";
// Components
import AdminTab from "../../components/AdminTab/AdminTab";
import LoadingPage from "../../components/LoadingPage/LoadingPage";
// Constants
import {
    PENDING_ADDITION,
    FAIL_ADDITION,
    PENDING_REMOVAL,
    FAIL_REMOVAL,
    SUCCESS,
    FAIL
} from "../../constants/transactions";

type AdminTabContainerProps = {
    isOpen: boolean
}

type Admin = {
    address: string,
    identifier: string,
    status: string
}

const AdminTabContainer: React.FC<AdminTabContainerProps> = ({ isOpen }) => {
    const { admins, isAdmin, userAddress, dataReady } = useAdminData();
    const {
        list,
        modals,
        toggleModal,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        openToast
    } = useTab(admins, (identifier: string) => ({ address: identifier }));

    const { drizzle } = drizzleReactHooks.useDrizzle();

    const { addAdmin, removeAdmin } = drizzle.contracts.Admin.methods as { 
        addAdmin: (value: string) => TransactionObject<never>, 
        removeAdmin: (value: string) => TransactionObject<never>};;

    const handleAdd = async (value: string) => {
        const gasLimit = await addAdmin(value).estimateGas({
            from: userAddress
        });
        addAdmin(value)
            .send({ from: userAddress, gas: gasLimit * 4 })
            .on("transactionHash", () => {
                toggleModal("add")();
                addTransaction(value, PENDING_ADDITION);
            })
            .on("receipt", receipt => {
                // Web3js returns true if true, null if false
                const event = idx(receipt, _ => _.events.AdminAdded);
                const added = Boolean(
                    idx(event, _ => _.returnValues.adminAdded)
                );
                if (!event) {
                    openToast(
                        value,
                        FAIL,
                        `Error while processing Admin account: ${value}`
                    );
                } else if (added) {
                    openToast(
                        value,
                        SUCCESS,
                        `New Admin account processed: ${value}`
                    );
                } else {
                    const message = idx(
                        receipt,
                        _ => _.events.AdminAdded.returnValues.message
                    );
                    openToast(value, FAIL, message);
                }
            })
            .on("error", error => {
                toggleModal("add")();
                updateTransaction(value, FAIL_ADDITION);
                errorToast(error, value, openToast, () =>
                    openToast(
                        value,
                        FAIL,
                        "Could not add account as admin",
                        `${value} was unable to be added. Please try again.`
                    )
                );
            });
    };

    const handleRemove = async (value: string) => {
        const gasLimit = await removeAdmin(value).estimateGas({
            from: userAddress
        });
        removeAdmin(value)
            .send({ from: userAddress, gas: gasLimit * 4 })
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
            .on("error", error => {
                toggleModal("remove")();
                updateTransaction(value, FAIL_REMOVAL);
                errorToast(error, value, openToast, () =>
                    openToast(
                        value,
                        FAIL,
                        "Could not remove admin account",
                        `${value} was unable to be removed. Please try again.`
                    )
                );
            });
    };

    const isValidAdmin = (address: string) => {
        let isValidAddress = isAddress(address);
        if (!isValidAddress) {
            return {
                valid: false
            };
        }

        let isAdmin = list.filter((item: Admin) => item.address === address).length > 0;
        if (isAdmin) {
            return {
                valid: false,
                msg: "Account address is already an admin."
            };
        }

        return {
            valid: true
        };
    };

    if (isOpen && dataReady) {
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
                isValid={isValidAdmin}
                isOpen={isOpen}
            />
        );
    } else if (isOpen && !dataReady) {
        return <LoadingPage />;
    } else {
        return <div />;
    }
};

AdminTabContainer.propTypes = {
    isOpen: PropTypes.bool.isRequired
};

export default AdminTabContainer;
