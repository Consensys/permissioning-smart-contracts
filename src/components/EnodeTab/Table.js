// Libs
import React from 'react';
import PropTypes from 'prop-types';
// Rimble Components
import { Table, Box } from 'rimble-ui';
// Components
import EnodeTableHeader from './TableHeader';
import EnodeRow from './Row';
import EmptyRow from './EmptyRow';
// Styles
import styles from './styles.module.scss';

const EnodeTable = ({ list, toggleModal, deleteTransaction, isAdmin, isReadOnly }) => (
  <Box mt={5}>
    <EnodeTableHeader
      number={list.length}
      openAddModal={toggleModal('add')}
      disabledAdd={!isAdmin}
      isReadOnly={isReadOnly}
    />
    <Table mt={4}>
      <thead>
        <tr>
          <th colSpan="2" className={styles.headerCell}>
            Node ID
          </th>
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
            isReadOnly={isReadOnly}
            {...enode}
          />
        ))}
        {list.length === 0 && <EmptyRow />}
      </tbody>
    </Table>
  </Box>
);

EnodeTable.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggleModal: PropTypes.func.isRequired,
  deleteTransaction: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isReadOnly: PropTypes.bool.isRequired
};

export default EnodeTable;
