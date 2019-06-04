// Libs
import React from "react";
import PropTypes from "prop-types";
// import { drizzleReactHooks } from "drizzle-react";
import { isAddress } from "web3-utils";
// Context
import { useData } from "../../context/data";
// Utils
import useTab from "./useTab";
// Components
import AccountTab from "../../components/AccountTab/AccountTab";
// Constants
import // PENDING_ADDITION,
// FAIL_ADDITION,
// PENDING_REMOVAL,
// FAIL_REMOVAL,
// SUCCESS,
// FAIL
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
        // addTransaction,
        // updateTransaction,
        deleteTransaction
        // openToast
    } = useTab(whitelist, (identifier: string) => ({ address: identifier }));

    const handleAdd = async (value: any) => {
        console.log(value);
    };

    const handleRemove = async (value: any) => {
        console.log(value);
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
