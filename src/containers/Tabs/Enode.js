// Libs
import React from "react";
import { drizzleReactHooks } from "drizzle-react";
import PropTypes from "prop-types";
import idx from "idx";
// Context
import { useAdminData } from "../../context/adminData";
import { useNodeData } from "../../context/nodeData";
// Utils
import useTab from "./useTab";
import {
    identifierToParams,
    paramsToIdentifier,
    enodeToParams,
    isValidEnode
} from "../../util/enodetools";
// Components
import EnodeTab from "../../components/EnodeTab/EnodeTab";
import LoadingPage from "../../components/LoadingPage/LoadingPage";
// Constants
import {
    PENDING_ADDITION,
    PENDING_REMOVAL,
    FAIL_ADDITION,
    FAIL_REMOVAL,
    PENDING_LOCK,
    PENDING,
    SUCCESS,
    FAIL
} from "../../constants/transactions";

const EnodeTabContainer = ({ isOpen }) => {
    const { isAdmin, dataReady: adminDataReady } = useAdminData();
    const { userAddress, whitelist, isReadOnly, dataReady } = useNodeData();

    const {
        list,
        modals,
        toggleModal,
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        openToast,
        updateToast
    } = useTab(whitelist, identifierToParams);

    const { drizzle } = drizzleReactHooks.useDrizzle();

    const {
        addEnode,
        removeEnode,
        enterReadOnly,
        exitReadOnly
    } = drizzle.contracts.NodeRules.methods;

    const handleAdd = async value => {
        const { enodeHigh, enodeLow, ip, port } = enodeToParams(value);
        const identifier = paramsToIdentifier({
            enodeHigh,
            enodeLow,
            ip,
            port
        });
        const gasLimit = await addEnode(
            enodeHigh,
            enodeLow,
            ip,
            port
        ).estimateGas({ from: userAddress });
        addEnode(enodeHigh, enodeLow, ip, port)
            .send({ from: userAddress, gasLimit: gasLimit * 4 })
            .on("transactionHash", () => {
                toggleModal("add")();
                addTransaction(identifier, PENDING_ADDITION);
            })
            .on("receipt", receipt => {
                const event = idx(receipt, _ => _.events.NodeAdded);
                const added = Boolean(
                    idx(event, _ => _.returnValues.nodeAdded)
                );
                if (!event) {
                    openToast(
                        value,
                        FAIL,
                        `Error while processing node: ${value}`
                    );
                } else if (added) {
                    openToast(
                        value,
                        SUCCESS,
                        `New whitelist node processed: ${value}`
                    );
                } else {
                    openToast(
                        value,
                        FAIL,
                        `Node "${value}" is already on whitelist`
                    );
                }
            })
            .on("error", () => {
                toggleModal("add")();
                updateTransaction(identifier, FAIL_ADDITION);
                openToast(
                    identifier,
                    FAIL,
                    "Could not add node to whitelist",
                    `${enodeHigh}${enodeLow} was unable to be added. Please try again`
                );
            });
    };

    const handleRemove = async value => {
        const { enodeHigh, enodeLow, ip, port } = identifierToParams(value);
        const gasLimit = await removeEnode(
            enodeHigh,
            enodeLow,
            ip,
            port
        ).estimateGas({ from: userAddress });
        removeEnode(enodeHigh, enodeLow, ip, port)
            .send({ from: userAddress, gasLimit: gasLimit * 4 })
            .on("transactionHash", () => {
                toggleModal("remove")();
                addTransaction(value, PENDING_REMOVAL);
            })
            .on("receipt", () => {
                openToast(
                    value,
                    SUCCESS,
                    `Removal of whitelisted node processed: ${enodeHigh}${enodeLow}`
                );
            })
            .on("error", () => {
                toggleModal("remove")();
                updateTransaction(value, FAIL_REMOVAL);
                openToast(
                    value,
                    FAIL,
                    "Could not remove node to whitelist",
                    `${enodeHigh}${enodeLow} was unable to be removed. Please try again.`
                );
            });
    };

    const handleLock = async () => {
        const method = isReadOnly ? exitReadOnly : enterReadOnly;
        const gasLimit = await method().estimateGas({ from: userAddress });
        method()
            .send({ from: userAddress, gasLimit: gasLimit * 4 })
            .on("transactionHash", () => {
                toggleModal("lock")();
                addTransaction("lock", PENDING_LOCK);
                openToast(
                    "lock",
                    PENDING,
                    isReadOnly
                        ? "Please wait while we unlock the values."
                        : "Please wait while we lock the whitelisted nodes. Once completed no changes can be made until you unlock the values.",
                    "",
                    15000
                );
            })
            .on("receipt", () => {
                deleteTransaction("lock");
                updateToast(
                    "lock",
                    SUCCESS,
                    isReadOnly
                        ? "Values have been unlocked!"
                        : "Changes have been locked!"
                );
            })
            .on("error", () => {
                toggleModal("lock")();
                deleteTransaction("lock");
                updateToast(
                    "lock",
                    FAIL,
                    isReadOnly
                        ? "Could not unlock values."
                        : "Could not lock changes.",
                    "The transaction was unabled to be processed. Please try again."
                );
            });
    };

    const allDataReady = dataReady && adminDataReady;

    if (isOpen && allDataReady) {
        return (
            <EnodeTab
                list={list}
                userAddress={userAddress}
                modals={modals}
                toggleModal={toggleModal}
                handleAdd={handleAdd}
                handleRemove={handleRemove}
                handleLock={handleLock}
                isAdmin={isAdmin}
                deleteTransaction={deleteTransaction}
                isValid={isValidEnode}
                pendingLock={!!transactions.get("lock")}
                isReadOnly={isReadOnly}
                isOpen={isOpen}
            />
        );
    } else if (isOpen && !allDataReady) {
        return <LoadingPage />;
    } else {
        return <div />;
    }
};

EnodeTabContainer.propTypes = {
    isOpen: PropTypes.bool.isRequired
};

export default EnodeTabContainer;
