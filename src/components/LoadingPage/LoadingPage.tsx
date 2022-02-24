// Libs
import React from 'react';

//import { Grid, Chip } from '@material-ui/core';
// Rimble Components
import { Loader, Flex, Box } from 'rimble-ui';

const LoadingPage: React.FC<{}> = () => (
  <Flex alignItems="center" justifyContent="center">
    <Box mt={5}>
      <Loader size="80px" />
    </Box>
  </Flex>
);

export default LoadingPage;
