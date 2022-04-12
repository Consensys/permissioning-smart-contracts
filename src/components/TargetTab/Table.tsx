// Libs
import React from 'react';
import PropTypes from 'prop-types';
import { TableContainer, Paper, Table, Box, TableHead, TableRow, TableBody, TableCell } from '@material-ui/core';
import {  Button, Flex, Form } from 'rimble-ui';
// Components
import AccountTableHeader from './TableHeader';
import AccountTableTransactionHeader from './TableTransactionHeader';
import AccountRow from './Row';
import AccountRowTransaction from './RowTansaction';
import EmptyRow from './EmptyRow';
// Styles
import styles from './styles.module.scss';

type AccountTable = {
  list: { address: string; status: string }[];
  listTransaction: { address: string; status: string ; executed:boolean; transactionId:number}[];
  toggleModal: (name: 'add' | 'remove' | 'lock') => (value?: boolean | string) => void;
  deleteTransaction: (identifier: string) => void;
  handleConfirm: (identifier: number) => void;
  handleRevoke: (identifier: number) => void;
  isAdmin: boolean;
  isReadOnly: boolean;
  modifyInputSearch: (input: { target: { value: string } }) => void;
  handleSearch: (e: MouseEvent) => void;
  handleClear: (e: MouseEvent) => void;
  inputSearch : string;
};

const AccountTable: React.FC<AccountTable> = ({ modifyInputSearch,inputSearch,handleSearch, handleClear, list, listTransaction,toggleModal, deleteTransaction, handleConfirm,handleRevoke,isAdmin, isReadOnly }) => (
  <Box mt={5}>
    <TableContainer component={Paper}>
      <AccountTableTransactionHeader
        number={listTransaction.length}
        isAdmin={isAdmin}
      />
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell className={styles.headerCell}>Target Address</TableCell>
            <TableCell className={styles.headerCell}>Status</TableCell>
            <TableCell className={styles.headerCell}>Confirm</TableCell>
            <TableCell className={styles.headerCell}>Revoke</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        
          {listTransaction.map(({ address, status,transactionId,executed }) => (
            isAdmin && <AccountRowTransaction
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
      <AccountTableHeader
        number={list.length}
        openAddModal={() => toggleModal('add')(true)}
        disabledAdd={!isAdmin || isReadOnly}
        isAdmin={isAdmin}
      />
      <Flex alignItems="center" justifyContent="space-between">
     
     <Form.Input
         width={1}
         type="text"
         name="input"
         placeholder="Search"
         onChange={modifyInputSearch}
         value={inputSearch}
         className={styles.fieldInput}
         required
       />
           <Button
       type="submit"
       ml={3}
       color="white"
       bg="pegasys"
       hovercolor="#25D78F"
       border={1}
       onClick={handleSearch}

     >
     Search
     </Button>
     <Button
       type="submit"
       ml={3}
       color="white"
       bg="pegasys"
       hovercolor="#25D78F"
       border={1}
       onClick={handleClear}

     >
     Clear
     </Button>
 </Flex>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell className={styles.headerCell}>Target Address</TableCell>
            <TableCell className={styles.headerCell}>Status</TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
        
          {list.map(({ address, status }) => (
           isAdmin && <AccountRow
              key={address}
              address={address}
              status={status}
              isAdmin={isAdmin}
              deleteTransaction={deleteTransaction}
         
              openRemoveModal={toggleModal('remove')}
            />
          ))}
          {list.length === 0 && <EmptyRow type="targets"/>}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

AccountTable.propTypes = {
  list: PropTypes.array.isRequired,
  listTransaction: PropTypes.array.isRequired,
  toggleModal: PropTypes.func.isRequired,
  deleteTransaction: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isReadOnly: PropTypes.bool.isRequired
};

export default AccountTable;
