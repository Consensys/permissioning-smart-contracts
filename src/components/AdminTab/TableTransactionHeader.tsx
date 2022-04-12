// Libs
import React from 'react';
import PropTypes from 'prop-types';
// Rimble Components
import { Flex, Box, Heading } from 'rimble-ui';
//import { Grid, Button, Icon, Typography } from '@material-ui/core';

type TableHeader = {
  number: Number;
  isAdmin: boolean;
};

const TableHeader: React.FC<TableHeader> = ({ number, isAdmin }) => (
  <Flex alignItems="center" justifyContent="space-between">
    <Box display="flex" alignItems="center">
      <Heading.h2 fontWeight="700">Transaction ({ isAdmin && number})</Heading.h2>
    </Box>
  </Flex>
);

TableHeader.propTypes = {
  number: PropTypes.number.isRequired
};

export default TableHeader;
