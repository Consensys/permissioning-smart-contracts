// Libs
import React from 'react';
import PropTypes from 'prop-types';
// Rimble Components
import { Grid, Box, Button } from '@material-ui/core';

type TableHeader = {
  number: Number;
  openAddModal: () => void;
  disabledAdd: boolean;
};

const TableHeader: React.FC<TableHeader> = ({ number, openAddModal, disabledAdd }) => (
  <Grid container alignItems="center" justifyContent="space-between">
    <Box display="flex" alignItems="center">
      <h2>Accounts ({number})</h2>
    </Box>
    <Grid container alignItems="center">
      <Button variant="contained" color="primary" onClick={() => openAddModal()} disabled={disabledAdd}>
        Add Account
      </Button>
    </Grid>
  </Grid>
);

TableHeader.propTypes = {
  number: PropTypes.number.isRequired,
  openAddModal: PropTypes.func.isRequired,
  disabledAdd: PropTypes.bool.isRequired
};

export default TableHeader;
