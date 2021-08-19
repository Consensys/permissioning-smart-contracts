// Libs
import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Box } from '@material-ui/core';

const NoContract: React.FC<{ tabName: string }> = ({ tabName }) => (
  <Box>
    <Grid alignItems="center">
      <p>
        Unable to locate <b>{tabName}</b> contract. Please review the Dapp configuration and confirm that the contract
        is correctly deployed.
      </p>
    </Grid>
  </Box>
);

NoContract.propTypes = {
  tabName: PropTypes.string.isRequired
};

export default NoContract;
