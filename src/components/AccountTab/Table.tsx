// Libs
import React from 'react';
import PropTypes from 'prop-types';
import { TableContainer, Paper, Table, Box, TableHead, TableRow, TableBody, TableCell } from '@material-ui/core';
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
    <TableContainer component={Paper}>
      <AccountTableHeader
        number={list.length}
        openAddModal={() => toggleModal('add')(true)}
        disabledAdd={!isAdmin || isReadOnly}
      />
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell className={styles.headerCell}>Account Address</TableCell>
            <TableCell className={styles.headerCell}>Status</TableCell>
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
    </TableContainer>
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
