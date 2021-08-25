// Libs
import React from 'react';
import { Grid, Chip } from '@material-ui/core';

const LoadingPage: React.FC<{}> = () => (
  <Grid container alignItems="center" justifyContent="center">
    <Chip color="primary" label="Loading" />
  </Grid>
);

export default LoadingPage;
