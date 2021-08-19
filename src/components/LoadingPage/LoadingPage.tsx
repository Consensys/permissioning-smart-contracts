// Libs
import React from 'react';
// Rimble Components
import { Grid, Box, Chip } from '@material-ui/core';

const LoadingPage: React.FC<{}> = () => (
  <Grid alignItems="center" justifyContent="center">
    <Box mt={5}>
      <Chip color="primary" label="Loading" />
    </Box>
  </Grid>
);

export default LoadingPage;
