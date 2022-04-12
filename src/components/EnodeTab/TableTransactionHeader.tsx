// Libs
import React from 'react';
import PropTypes from 'prop-types';
//import { Grid, Button, Icon, Typography } from '@material-ui/core';
// Rimble Components
import { Flex, Box, Heading } from 'rimble-ui';

type TableHeader = {
  number: number;
  isAdmin: boolean;
};

const TableHeader: React.FC<TableHeader> = ({ number , isAdmin}) => (
  <Flex alignItems="center" justifyContent="space-between">
    <Box>
      <Heading.h2 fontWeight="700">Transactions ({isAdmin && number})</Heading.h2>
    </Box>
  </Flex>
);

TableHeader.propTypes = {
  number: PropTypes.number.isRequired
};

export default TableHeader;
