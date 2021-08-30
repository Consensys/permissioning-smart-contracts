// Libs
import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Box, Typography } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';

const NoContract: React.FC<{ tabName: string }> = ({ tabName }) => (
  <Box>
    <Grid container alignItems="center">
      <WarningIcon />
      <Typography variant="body1" color="error">
        Unable to locate {tabName} contract. Please review the Dapp configuration and confirm that the contract is
        correctly deployed.
      </Typography>
    </Grid>
  </Box>
);

NoContract.propTypes = {
  tabName: PropTypes.string.isRequired
};

export default NoContract;
