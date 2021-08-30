// Libs
import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Button, Icon, Typography } from '@material-ui/core';

type TableHeader = {
  number: Number;
  openAddModal: () => void;
  disabledAdd: boolean;
};

const TableHeader: React.FC<TableHeader> = ({ number, openAddModal, disabledAdd }) => (
  <Grid container alignItems="center" justifyContent="space-between">
    <Typography variant="h2">Admins ({number})</Typography>
    <Button
      color="primary"
      variant="contained"
      onClick={() => openAddModal()}
      disabled={disabledAdd}
      startIcon={<Icon>add_circle</Icon>}
    >
      Add Admin
    </Button>
  </Grid>
);

TableHeader.propTypes = {
  number: PropTypes.number.isRequired,
  openAddModal: PropTypes.func.isRequired,
  disabledAdd: PropTypes.bool.isRequired
};

export default TableHeader;
