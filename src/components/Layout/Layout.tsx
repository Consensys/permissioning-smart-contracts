// Libs
import React from 'react';
import PropTypes from 'prop-types';
// Rimble Components
import { Flex, Box } from 'rimble-ui';
// Containers
import AppBar from '../AppBar/AppBar';

const Layout: React.FC<{}> = ({ children }) => (
  <Flex pl={5} pr={5} flexDirection="column" bg="rgba( 200, 200, 200, .1)" minHeight="100vh" alignItems="center">
    <AppBar />
    <Box width={4 / 5} mt={5} mb={3}>
      {children}
    </Box>
  </Flex>
);

Layout.propTypes = {
  children: PropTypes.object.isRequired
};

export default Layout;
