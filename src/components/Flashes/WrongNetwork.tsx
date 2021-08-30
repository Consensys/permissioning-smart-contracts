// Libs
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, Typography } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';

const WrongNetwork: React.FC<{ networkId: number }> = ({ networkId }) => (
  <Box>
    <Grid container alignItems="center">
      <WarningIcon />
      <Typography variant="body1" color="error">
        Connect to the network where the contracts are deployed.
      </Typography>
    </Grid>
    <Grid container alignItems="center">
      <div className="wrongNetworkMessage">
        <Typography variant="body1">
          Change your network using MetaMask.
          {networkId === 1
            ? " You're currently on the Main Ethereum Network."
            : networkId === 2
            ? " You're currently on the Morden Classic Test Network."
            : networkId === 3
            ? " You're currently on the Ropsten Test Network."
            : networkId === 4
            ? " You're currently on the Rinkeby Test Network."
            : networkId === 5
            ? " You're currently on the Goerli Test Network."
            : ` You're currently on unknown network of id ${networkId}.`}
        </Typography>
      </div>
    </Grid>
  </Box>
);

WrongNetwork.propTypes = {
  networkId: PropTypes.number.isRequired
};

export default WrongNetwork;
