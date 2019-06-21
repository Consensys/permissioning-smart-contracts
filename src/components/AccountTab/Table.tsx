// Libs
import React from "react";
import PropTypes from "prop-types";
// Rimble Components
import { Table, Box } from "rimble-ui";
// Components
import AccountTableHeader from "./TableHeader";
import AccountRow from "./Row";
import EmptyRow from "./EmptyRow";
// Styles
import styles from "./styles.module.scss";

type AccountTable = {
  list: {address: string, status: string}[],
  toggleModal: (name: "add"|"remove"|"lock") => (value?: boolean | string) => void,
  deleteTransaction: () => void,
  isAdmin: boolean,
  userAddress: string,
  isReadOnly: boolean,
  pendingLock: boolean
}

const AccountTable: React.FC<AccountTable> = ({
    list,
    toggleModal,
    deleteTransaction,
    isAdmin,
    userAddress,
    isReadOnly,
    pendingLock
}) => (
    <Box mt={5}>
        <AccountTableHeader
            number={list.length}
            openAddModal={toggleModal("add")}
            disabledAdd={!isAdmin}
        />
        <Table mt={4}>
            <thead>
                <tr>
                    <th className={styles.headerCell}>Account Address</th>
                    <th className={styles.headerCell}>Status</th>
                </tr>
            </thead>
            <tbody>
                {list.map(({ address, status }) => (
                    <AccountRow
                        key={address}
                        address={address}
                        status={status}
                        isAdmin={isAdmin}
                        deleteTransaction={deleteTransaction}
                        openRemoveModal={toggleModal("remove")}
                    />
                ))}
                {list.length === 0 && <EmptyRow />}
            </tbody>
        </Table>
    </Box>
);

AccountTable.propTypes = {
    list: PropTypes.array.isRequired,
    toggleModal: PropTypes.func.isRequired,
    deleteTransaction: PropTypes.func.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    userAddress: PropTypes.string.isRequired,
    isReadOnly: PropTypes.bool.isRequired,
    pendingLock: PropTypes.bool.isRequired
};

export default AccountTable;
