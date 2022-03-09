// Libs
import React from 'react';
import PropTypes from 'prop-types';
// Rimble Components
import { TableContainer, Paper, Table, Box, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
//import { Table, Box, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
// Components
import AdminTableHeader from './TableHeader';
import AdminTableTransactionHeader from './TableTransactionHeader';
import AdminRow from './Row';
import AdminRowTransaction from './RowTansaction';
import EmptyRow from './EmptyRow';
// Styles
import styles from './styles.module.scss';

type AdminTable = {
  list: { address: string; status: string }[];
  listTransaction: { address: string; status: string; executed: boolean; transactionId: number }[];
  toggleModal: (name: 'add' | 'remove' | 'lock') => (value?: boolean | string) => void;
  deleteTransaction: (identifer: string) => void;
  handleConfirm: (identifier: number) => void;
  handleRevoke: (identifier: number) => void;
  isAdmin: boolean;
  userAddress?: string;
};

const AdminTable: React.FC<AdminTable> = ({
  list,
  listTransaction,
  toggleModal,
  deleteTransaction,
  handleConfirm,
  handleRevoke,
  isAdmin,
  userAddress
}) => (
  <Box mt={5}>
    <TableContainer component={Paper}>
      <AdminTableTransactionHeader number={listTransaction.length} isAdmin={isAdmin} />
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell className={styles.headerCell}>Account Address</TableCell>
            <TableCell className={styles.headerCell}>Status</TableCell>
            <TableCell className={styles.headerCell}>Confirm</TableCell>
            <TableCell className={styles.headerCell}>Revoke</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listTransaction.map(({ address, status, transactionId, executed }) => (
            isAdmin && <AdminRowTransaction
              key={address}
              address={address}
              status={status}
              transactionId={transactionId}
              executed={executed}
              isAdmin={isAdmin}
              deleteTransaction={deleteTransaction}
              handleConfirm={handleConfirm}
              handleRevoke={handleRevoke}
              openRemoveModal={toggleModal('remove')}
            />
          ))}
          {listTransaction.length === 0 && <EmptyRow type="transactions" />}
        </TableBody>
      </Table>
    </TableContainer>
    <TableContainer component={Paper}>
      <AdminTableHeader number={list.length} openAddModal={() => toggleModal('add')(true)} disabledAdd={!isAdmin} isAdmin={isAdmin}/>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell className={styles.headerCell}>Account Address</TableCell>
            <TableCell className={styles.headerCell}>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list.map(({ address, status }) => (
          isAdmin &&  <AdminRow
              key={address}
              address={address}
              status={status}
              isSelf={userAddress === address}
              isAdmin={isAdmin}
              deleteTransaction={deleteTransaction}
              openRemoveModal={toggleModal('remove')}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

AdminTable.propTypes = {
  list: PropTypes.array.isRequired,
  listTransaction: PropTypes.array.isRequired,
  toggleModal: PropTypes.func.isRequired,
  deleteTransaction: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  userAddress: PropTypes.string
};

export default AdminTable;
