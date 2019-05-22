// Libs
import { useState, useEffect } from "react";
// Hooks
import useModal from "./useModal";
import useToast from "./useToast";
import useTransaction from "./useTransaction";
// Utils
import { arrayInclude, areArrayEqual, areMapEqual } from "../../util/array";

export default (originalList, identifierToParams) => {
    const [list, setList] = useState(originalList);
    const { modals, toggleModal } = useModal();
    const {
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        setTransactions
    } = useTransaction();
    const { toasts, openToast, updateToast, closeToast } = useToast();

    useEffect(() => {
        const updatedTransactions = new Map([...transactions]);
        // Delete old pending removals
        transactions.forEach((status, identifier) => {
            if (
                status === "pendingRemoval" &&
                !arrayInclude(originalList, { identifier })
            ) {
                updatedTransactions.delete(identifier);
            }
        });
        // Derive list and delete old pending additions
        const derivedList = originalList.map(({ identifier, ...rest }) => {
            if (updatedTransactions.has(identifier)) {
                const status = updatedTransactions.get(identifier);
                if (status === "pendingAddition") {
                    updatedTransactions.delete(identifier);
                }
                return { ...rest, identifier, status };
            }
            return { ...rest, identifier };
        });
        // Gather the pending and failed additions from updatedTransactions
        const pending = [];
        updatedTransactions.forEach((status, identifier) => {
            if (status === "pendingAddition" || status === "failAddition") {
                pending.push({
                    identifier,
                    status,
                    ...identifierToParams(identifier)
                });
            }
        });

        const updatedList = [...pending, ...derivedList];

        if (!areArrayEqual(updatedList, list, ["identifier", "status"])) {
            setList(updatedList);
        }
        if (!areMapEqual(updatedTransactions, transactions)) {
            setTransactions(updatedTransactions);
        }
    }, [transactions, originalList, list, identifierToParams, setTransactions]);

    return {
        list,
        modals,
        toggleModal,
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        toasts,
        openToast,
        updateToast,
        closeToast
    };
};
