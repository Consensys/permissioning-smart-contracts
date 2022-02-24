// Libs
import React from 'react';
import PropTypes from 'prop-types';
//import { Grid, Button, Icon, Typography } from '@material-ui/core';
// Rimble Components
import { Flex, Box, Heading, Button } from 'rimble-ui';

type TableHeader = {
  number: number;
};

const TableHeader: React.FC<TableHeader> = ({ number }) => (
  <Flex alignItems="center" justifyContent="space-between">
    <Box>
      <Heading.h2 fontWeight="700">Transactions ({number})</Heading.h2>
    </Box>
  </Flex>
);

TableHeader.propTypes = {
  number: PropTypes.number.isRequired
};

export default TableHeader;
