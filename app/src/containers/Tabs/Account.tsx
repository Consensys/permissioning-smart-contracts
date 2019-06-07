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
import AccountTab from "../../components/AccountTab/AccountTab";
// Constants
import {PENDING_ADDITION,
FAIL_ADDITION,
PENDING_REMOVAL,
FAIL_REMOVAL,
SUCCESS,
FAIL} from
"../../constants/transactions";

type AccountTabContainerProps = {
  isOpen: boolean
}

const AccountTabContainer: React.FC<AccountTabContainerProps> = ({ isOpen }) => {
    const { isAdmin, userAddress, account: {whitelist, isReadOnly} } = useData();

    const {
        list,
        modals,
        toggleModal,
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        openToast
    } = useTab(whitelist, (identifier: string) => ({ address: identifier }));

    const { drizzle } = drizzleReactHooks.useDrizzle();

    const { addAccount, removeAccount } = drizzle.contracts.AccountRules.methods;

    const handleAdd = async (value: any) => {
        const gasLimit = await addAccount(value).estimateGas({
            from: userAddress
        });
        addAccount(value)
            .send({ from: userAddress, gasLimit: gasLimit * 4 })
            .on("transactionHash", () => {
                toggleModal("add")();
                addTransaction(value, PENDING_ADDITION);
            })
            .on("receipt", () => {
                openToast(
                    value,
                    SUCCESS,
                    `New whitelisted account processed: ${value}`
                );
            })
            .on("error", () => {
                toggleModal("add")();
                updateTransaction(value, FAIL_ADDITION);
                openToast(
                    value,
                    FAIL,
                    "Could not add whitelisted account",
                    `${value} was unable to be added. Please try again.`
                );
            });
    };

    const handleRemove = async (value: any) => {
        const gasLimit = await removeAccount(value).estimateGas({
            from: userAddress
        });
        removeAccount(value)
            .send({ from: userAddress, gasLimit: gasLimit * 4 })
            .on("transactionHash", () => {
                toggleModal("remove")();
                addTransaction(value, PENDING_REMOVAL);
            })
            .on("receipt", () => {
                openToast(
                    value,
                    SUCCESS,
                    `Removal of whitelisted account processed: ${value}`
                );
            })
            .on("error", () => {
                toggleModal("remove")();
                updateTransaction(value, FAIL_REMOVAL);
                openToast(
                    value,
                    FAIL,
                    "Could not remove whitelisted account",
                    `${value} was unable to be removed. Please try again.`
                );
            });
    };

    return (
        <AccountTab
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
            isReadOnly={isReadOnly}
            pendingLock={!!transactions.get("lock")}
        />
    );
};

AccountTabContainer.propTypes = {
    isOpen: PropTypes.bool.isRequired
};

export default AccountTabContainer;
