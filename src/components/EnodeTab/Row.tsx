// Libs
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Chip, Grid, TableCell, TableRow } from '@material-ui/core';
// Constant
import { PENDING_ADDITION, PENDING_REMOVAL, FAIL_ADDITION, FAIL_REMOVAL } from '../../constants/transactions';
// Components
import TextWithTooltip from './TextWithTooltip';
// Styles
import styles from './styles.module.scss';

type EnodeRow = {
  isAdmin: boolean;
  deleteTransaction: (address: string) => void;
  openRemoveModal: (address: string) => void;
  enodeId: string;
  host: string;
  port: string;
  status: string;
  identifier: string;
};

const EnodeRow: React.FC<EnodeRow> = ({
  isAdmin,
  deleteTransaction,
  openRemoveModal,
  enodeId,
  host,
  port,
  status,
  identifier
}) => (
  <TableRow className={styles.row}>
    <TableCell>
      <Box className={styles.ellipsis} maxWidth="700px">
        <TextWithTooltip isAdmin={isAdmin} status={status} text={enodeId} />
      </Box>
    </TableCell>
    <TableCell>
      <TextWithTooltip isAdmin={isAdmin} status={status} text={host} />
    </TableCell>
    <TableCell>
      <TextWithTooltip isAdmin={isAdmin} status={status} text={port} />
    </TableCell>
    <TableCell>
      {status === 'active' ? (
        <Chip color="primary" className={styles.pill} label="Active" />
      ) : status === PENDING_ADDITION ? (
        <Chip color="secondary" className={styles.pill} label="Pending Addition" />
      ) : status === PENDING_REMOVAL ? (
        <Chip color="secondary" className={styles.pill} label="Pending Removal" />
      ) : status === FAIL_ADDITION ? (
        <Grid container>
          <Chip className={styles.pill} label="Addition Failed" />
          <Chip color="secondary" className={styles.pill} onClick={() => deleteTransaction(identifier)} label="Clear" />
        </Grid>
      ) : status === FAIL_REMOVAL ? (
        <Grid container>
          <Chip className={styles.pill} label="Removal Failed" />
          <Chip color="secondary" className={styles.pill} onClick={() => deleteTransaction(identifier)} label="Clear" />
        </Grid>
      ) : (
        <div />
      )}
    </TableCell>
    <TableCell>
      {isAdmin && status === 'active' && (
        <Chip className={styles.removeIcon} onDelete={() => openRemoveModal(identifier)} />
      )}
    </TableCell>
  </TableRow>
);

EnodeRow.propTypes = {
  enodeId: PropTypes.string.isRequired,
  host: PropTypes.string.isRequired,
  port: PropTypes.string.isRequired,
  identifier: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  deleteTransaction: PropTypes.func.isRequired
};

export default EnodeRow;
