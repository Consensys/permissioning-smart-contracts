// Libs
import React from 'react';
import PropTypes from 'prop-types';
import { Table, Box, TableHead, TableRow, TableBody } from '@material-ui/core';
// Components
import AccountTableHeader from './TableHeader';
import AccountRow from './Row';
import EmptyRow from './EmptyRow';
// Styles
import styles from './styles.module.scss';

type AccountTable = {
  list: { address: string; status: string }[];
  toggleModal: (name: 'add' | 'remove' | 'lock') => (value?: boolean | string) => void;
  deleteTransaction: (identifier: string) => void;
  isAdmin: boolean;
  isReadOnly: boolean;
};

const AccountTable: React.FC<AccountTable> = ({ list, toggleModal, deleteTransaction, isAdmin, isReadOnly }) => (
  <Box mt={5}>
    <AccountTableHeader
      number={list.length}
      openAddModal={() => toggleModal('add')(true)}
      disabledAdd={!isAdmin || isReadOnly}
    />
    <Table>
      <TableHead>
        <TableRow>
          <th className={styles.headerCell}>Account Address</th>
          <th className={styles.headerCell}>Status</th>
        </TableRow>
      </TableHead>
      <TableBody>
        {list.map(({ address, status }) => (
          <AccountRow
            key={address}
            address={address}
            status={status}
            isAdmin={isAdmin}
            deleteTransaction={deleteTransaction}
            openRemoveModal={toggleModal('remove')}
          />
        ))}
        {list.length === 0 && <EmptyRow />}
      </TableBody>
    </Table>
  </Box>
);

AccountTable.propTypes = {
  list: PropTypes.array.isRequired,
  toggleModal: PropTypes.func.isRequired,
  deleteTransaction: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isReadOnly: PropTypes.bool.isRequired
};

export default AccountTable;
