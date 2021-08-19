// Libs
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Grid } from '@material-ui/core';
// Styles
import styles from './styles.module.scss';

const WrongNetwork: React.FC<{ networkId: number }> = ({ networkId }) => (
  <Box>
    <Grid alignItems="center">
      <b>Connect to the network where the contracts are deployed.</b>
    </Grid>
    <Grid alignItems="center">
      <div className={styles.icon} />
      <p className="wrongNetworkMessage">
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
      </p>
    </Grid>
  </Box>
);

WrongNetwork.propTypes = {
  networkId: PropTypes.number.isRequired
};

export default WrongNetwork;
