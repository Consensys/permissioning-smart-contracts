// Libs
import React from 'react';
import PropTypes from 'prop-types';
//import { TableContainer, Paper, Table, Box, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';
import { Table, Box } from 'rimble-ui';

// Components
import EnodeTableHeader from './TableHeader';
import EnodeTableTransactionHeader from './TableTransactionHeader';
import EnodeRow from './Row';
import EnodeRowTransaction from './RowTransaction';
import EmptyRow from './EmptyRow';
// Styles
import styles from './styles.module.scss';
import { Enode } from '../../util/enodetools';

type EnodeTable = {
  list: (Enode & { identifier: string; status: string } )[];
  listTransaction: (Enode & { identifier: string; status: string ; executed:boolean; transactionId:number} )[];
  toggleModal: (name: 'add' | 'remove' | 'lock') => (value?: boolean | string) => void;
  deleteTransaction: (identifier: string) => void;
  handleConfirm: (identifier: number) => void;
  handleRevoke: (identifier: number) => void;
  isAdmin: boolean;
  isReadOnly: boolean;
};

const EnodeTable: React.FC<EnodeTable> = ({ list, listTransaction,toggleModal, deleteTransaction,  handleConfirm,handleRevoke,isAdmin }) => (
  <Box mt={5}>
    <EnodeTableTransactionHeader number={listTransaction.length}  />
    <Table mt={4}>
      <thead>
        <tr>
          <th className={styles.headerCell}>Type</th>
          <th className={styles.headerCell}>Node Name</th>
          <th className={styles.headerCell}>Organization</th>
          <th className={styles.headerCell}>Public Key</th>
          <th className={styles.headerCell}>IP Address</th>
          <th className={styles.headerCell}>Port</th>
          <th className={styles.headerCell}>Status</th>
          <th className={styles.headerCell}>Confirm</th>
          <th className={styles.headerCell}>Revoke</th>
        </tr>
      </thead>
      <tbody>
        {listTransaction.map(enode => (
          <EnodeRowTransaction
            key={enode.identifier}
            isAdmin={isAdmin}
            deleteTransaction={deleteTransaction}
            handleConfirm={handleConfirm}
            handleRevoke={handleRevoke}
            openRemoveModal={toggleModal('remove')}
            {...enode}
          />
        ))}
        {list.length === 0 && <EmptyRow />}
      </tbody>
    </Table>
    <br/>
    <EnodeTableHeader number={list.length} openAddModal={() => toggleModal('add')(true)} disabledAdd={!isAdmin} />
    <Table mt={4}>
      <thead>
        <tr>
          <th className={styles.headerCell}>Type</th>
          <th className={styles.headerCell}>Node Name</th>
          <th className={styles.headerCell}>Organization</th>
          <th className={styles.headerCell}>Public Key</th>
          <th className={styles.headerCell}>IP Address</th>
          <th className={styles.headerCell}>Port</th>
          <th className={styles.headerCell}>Status</th>
        </tr>
      </thead>
      <tbody>
        {list.map(enode => (
          <EnodeRow
            key={enode.identifier}
            isAdmin={isAdmin}
            deleteTransaction={deleteTransaction}

            openRemoveModal={toggleModal('remove')}
            {...enode}
          />
        ))}
        {list.length === 0 && <EmptyRow />}
      </tbody>
    </Table>
  </Box>
);

EnodeTable.propTypes = {
  list: PropTypes.array.isRequired,
  toggleModal: PropTypes.func.isRequired,
  deleteTransaction: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired
};

export default EnodeTable;
