// Libs
import { useState, useCallback } from "react";

export default () => {
    const [transactions, setTransactions] = useState(new Map());

    const addTransaction = useCallback((identifier, status) => {
        setTransactions(transactions => {
            const updatedTransactions = new Map([...transactions]);
            updatedTransactions.set(identifier, status);
            return updatedTransactions;
        });
    }, []);

    const updateTransaction = useCallback(
        (identifier, status) => addTransaction(identifier, status),
        [addTransaction]
    );

    const deleteTransaction = useCallback(identifier => {
        setTransactions(transactions => {
            const updatedTransactions = new Map([...transactions]);
            updatedTransactions.delete(identifier);
            return updatedTransactions;
        });
    }, []);

    return {
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        setTransactions
    };
};
