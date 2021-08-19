// Libs
import React from 'react';
import { Box, Link, Grid } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
// Styles
import styles from './styles.module.scss';

const NoProvider: React.FC<{}> = () => (
  <Box>
    <Grid container alignItems="center">
      <WarningIcon />
      <b>You are not connected to your network.</b>
    </Grid>
    <Grid container alignItems="center">
      <div className={styles.icon} />
      <p>
        If you need help, we recommend MetaMask to connect, see
        <Link href="https://www.metamask.io" target="_blank" title="Access MetaMask page">
          www.metamask.io
        </Link>
      </p>
    </Grid>
  </Box>
);

export default NoProvider;
