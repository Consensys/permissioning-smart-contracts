// Libs
import React from 'react';
import PropTypes from 'prop-types';
// Rimble Components
import { Flex, Box, Heading, Button } from 'rimble-ui';
//import { Grid, Button, Icon, Typography } from '@material-ui/core';

type TableHeader = {
  number: Number;
  openAddModal: () => void;
  disabledAdd: boolean;
  isAdmin: boolean;
};

const TableHeader: React.FC<TableHeader> = ({  number, openAddModal, disabledAdd ,isAdmin}) => (
  <Flex alignItems="center" justifyContent="space-between">
    <Box display="flex" alignItems="center">
      <Heading.h2 fontWeight="700">Targets ({ isAdmin && number})</Heading.h2>
    </Box>
    <Flex alignItems="center">
      <Button icon="AddCircleOutline" mainColor="#25D78F" onClick={() => openAddModal()} disabled={disabledAdd}>
        Add Target
      </Button>
    </Flex>
  </Flex>
);

TableHeader.propTypes = {
  number: PropTypes.number.isRequired,
  openAddModal: PropTypes.func.isRequired,
  disabledAdd: PropTypes.bool.isRequired
};

export default TableHeader;
