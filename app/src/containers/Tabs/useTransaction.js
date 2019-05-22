// Libs
import { useState } from "react";

export default () => {
    const [transactions, setTransactions] = useState(new Map());

    const addTransaction = (identifier, status) => {
        setTransactions(transactions => {
            const updatedTransactions = new Map([...transactions]);
            updatedTransactions.set(identifier, status);
            return updatedTransactions;
        });
    };

    const updateTransaction = (identifier, status) =>
        addTransaction(identifier, status);

    const deleteTransaction = identifier => {
        const updatedTransactions = new Map([...transactions]);
        updatedTransactions.delete(identifier);
        setTransactions(transactions => {
            const updatedTransactions = new Map([...transactions]);
            updatedTransactions.delete(identifier);
            return updatedTransactions;
        });
    };

    return {
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        setTransactions
    };
};
