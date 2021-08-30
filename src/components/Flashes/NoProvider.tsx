// Libs
import React from 'react';
import { Box, Link, Grid, Typography } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';

const NoProvider: React.FC<{}> = () => (
  <Box>
    <Grid container alignItems="center">
      <WarningIcon />
      <Typography variant="body1" color="error">
        You are not connected to your network.
      </Typography>
    </Grid>
    <Grid container alignItems="center">
      <Typography variant="body1">If you need help, we recommend MetaMask to connect: </Typography>
      <Typography variant="body1">
        <Link href="https://www.metamask.io" target="_blank" title="MetaMask.io">
          https://www.metamask.io
        </Link>
      </Typography>
    </Grid>
  </Box>
);

export default NoProvider;
