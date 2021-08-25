// Libs
import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Box } from '@material-ui/core';
// Containers
import AppBar from '../AppBar/AppBar';
import Footer from '../Footer';

const Layout: React.FC<{}> = ({ children }) => (
  <Grid container direction="column">
    <AppBar />
    <Box width={4 / 5} mt={5} mb={3}>
      {children}
    </Box>
    <Footer />
  </Grid>
);

Layout.propTypes = {
  children: PropTypes.object.isRequired
};

export default Layout;
