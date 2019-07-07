// Libs
import { useState, useEffect } from 'react';
// Hooks
import useModal from './useModal';
import { useToast } from '../../context/toasts';
import useTransaction from './useTransaction';
// Utils
import { arrayInclude, areArrayEqual, areMapEqual } from '../../util/array';
// Constants
import { PENDING_ADDITION, PENDING_REMOVAL, FAIL_ADDITION, FAIL_REMOVAL } from '../../constants/transactions';

export default (originalList, identifierToParams) => {
  const [list, setList] = useState(originalList);
  const { modals, toggleModal } = useModal();
  const { transactions, addTransaction, updateTransaction, deleteTransaction, setTransactions } = useTransaction();
  const { openToast, updateToast, closeToast } = useToast();

  useEffect(() => {
    const updatedTransactions = new Map([...transactions]);
    // Delete old pending removals
    transactions.forEach((status, identifier) => {
      if (status === PENDING_REMOVAL && !arrayInclude(originalList, { identifier })) {
        updatedTransactions.delete(identifier);
      }
    });
    // Derive list and delete old pending additions
    const derivedList = originalList.map(({ identifier, ...rest }) => {
      if (updatedTransactions.has(identifier)) {
        const status = updatedTransactions.get(identifier);
        if (
          status === PENDING_ADDITION ||
          (status === FAIL_ADDITION && rest.status === 'active') ||
          (status === FAIL_REMOVAL && rest.status === 'active')
        ) {
          updatedTransactions.delete(identifier);
        } else {
          return { ...rest, identifier, status };
        }
      }
      return { ...rest, identifier };
    });
    // Gather the pending and failed additions from updatedTransactions
    const pending = [];
    updatedTransactions.forEach((status, identifier) => {
      if (status === PENDING_ADDITION || status === FAIL_ADDITION) {
        pending.push({
          identifier,
          status,
          ...identifierToParams(identifier)
        });
      }
    });

    const updatedList = [...pending, ...derivedList];

    if (!areArrayEqual(updatedList, list, ['identifier', 'status'])) {
      setList(updatedList);
    }
    if (!areMapEqual(updatedTransactions, transactions)) {
      setTransactions(updatedTransactions);
    }
  }, [transactions, originalList, list, identifierToParams, setTransactions, deleteTransaction]);

  return {
    list,
    modals,
    toggleModal,
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    openToast,
    updateToast,
    closeToast
  };
};
