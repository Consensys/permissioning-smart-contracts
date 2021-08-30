// Libs
import React from 'react';
import PropTypes from 'prop-types';
import { TableContainer, Paper, Table, Box, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';
// Components
import EnodeTableHeader from './TableHeader';
import EnodeRow from './Row';
import EmptyRow from './EmptyRow';
// Styles
import styles from './styles.module.scss';
import { Enode } from '../../util/enodetools';

type EnodeTable = {
  list: (Enode & { identifier: string; status: string })[];
  toggleModal: (name: 'add' | 'remove' | 'lock') => (value?: boolean | string) => void;
  deleteTransaction: (identifier: string) => void;
  isAdmin: boolean;
  isReadOnly: boolean;
};

const EnodeTable: React.FC<EnodeTable> = ({ list, toggleModal, deleteTransaction, isAdmin }) => (
  <Box mt={5}>
    <EnodeTableHeader number={list.length} openAddModal={() => toggleModal('add')(true)} disabledAdd={!isAdmin} />
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell className={styles.headerCell}>Node ID</TableCell>
            <TableCell className={styles.headerCell}>Host</TableCell>
            <TableCell className={styles.headerCell}>Port</TableCell>
            <TableCell colSpan={2} className={styles.headerCell}>
              Status
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
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
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

EnodeTable.propTypes = {
  list: PropTypes.array.isRequired,
  toggleModal: PropTypes.func.isRequired,
  deleteTransaction: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired
};

export default EnodeTable;
