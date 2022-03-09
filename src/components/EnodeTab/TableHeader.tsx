// Libs
import React from 'react';
import PropTypes from 'prop-types';
//import { Grid, Button, Icon, Typography } from '@material-ui/core';
// Rimble Components
import { Flex, Box, Heading, Button } from 'rimble-ui';

type TableHeader = {
  number: number;
  openAddModal: () => void;
  disabledAdd: boolean;
  isAdmin: boolean;
};

const TableHeader: React.FC<TableHeader> = ({ number, openAddModal, disabledAdd, isAdmin }) => (
  <Flex alignItems="center" justifyContent="space-between">
    <Box>
      <Heading.h2 fontWeight="700">Nodes ({isAdmin && number})</Heading.h2>
    </Box>
    <Flex alignItems="center">
      <Button icon="AddCircleOutline" mainColor="#25D78F" onClick={() => openAddModal()} disabled={disabledAdd}>
        Add Node
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
