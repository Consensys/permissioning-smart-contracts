// Libs
import React from 'react';
import PropTypes from 'prop-types';
// Rimble Components
import { Flex, Box, Heading, Button } from 'rimble-ui';
//import { Grid, Button, Icon, Typography } from '@material-ui/core';

type TableHeader = {
  number: Number;
};

const TableHeader: React.FC<TableHeader> = ({ number }) => (
  <Flex alignItems="center" justifyContent="space-between">
    <Box display="flex" alignItems="center">
      <Heading.h2 fontWeight="700">Transaction ({number})</Heading.h2>
    </Box>
  </Flex>
);

TableHeader.propTypes = {
  number: PropTypes.number.isRequired
};

export default TableHeader;
