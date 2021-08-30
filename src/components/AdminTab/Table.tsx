// Libs
import React from 'react';
import PropTypes from 'prop-types';
// Rimble Components
import { Table, Box, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
// Components
import AdminTableHeader from './TableHeader';
import AdminRow from './Row';
// Styles
import styles from './styles.module.scss';

type AdminTable = {
  list: { address: string; status: string }[];
  toggleModal: (name: 'add' | 'remove' | 'lock') => (value?: boolean | string) => void;
  deleteTransaction: (identifer: string) => void;
  isAdmin: boolean;
  userAddress?: string;
};

const AdminTable: React.FC<AdminTable> = ({ list, toggleModal, deleteTransaction, isAdmin, userAddress }) => (
  <Box mt={5}>
    <AdminTableHeader number={list.length} openAddModal={() => toggleModal('add')(true)} disabledAdd={!isAdmin} />
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell className={styles.headerCell}>Account Address</TableCell>
          <TableCell className={styles.headerCell}>Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {list.map(({ address, status }) => (
          <AdminRow
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
  </Box>
);

AdminTable.propTypes = {
  list: PropTypes.array.isRequired,
  toggleModal: PropTypes.func.isRequired,
  deleteTransaction: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  userAddress: PropTypes.string
};

export default AdminTable;
