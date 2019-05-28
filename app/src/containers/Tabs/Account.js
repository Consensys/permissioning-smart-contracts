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

const AccountTabContainer = ({ isOpen }) => {
    const { isAdmin, userAddress } = useData();

    const {
        list,
        modals,
        toggleModal,
        // addTransaction,
        // updateTransaction,
        deleteTransaction
        // openToast
    } = useTab([], identifier => ({ address: identifier }));

    const handleAdd = async value => {
        console.log(value);
    };

    const handleRemove = async value => {
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
        />
    );
};

AccountTabContainer.propTypes = {
    isOpen: PropTypes.bool.isRequired
};

export default AccountTabContainer;
