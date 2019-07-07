// Libs
import React from 'react';
import PropTypes from 'prop-types';
// Rimble Components
import { Flex, Box, Heading, Button, Icon, Tooltip } from 'rimble-ui';
// Styles
import styles from './styles.module.scss';

type TableHeader = {
  number: Number;
  openAddModal: () => void;
  disabledAdd: boolean;
};

const TableHeader: React.FC<TableHeader> = ({ number, openAddModal, disabledAdd }) => (
  <Flex alignItems="center" justifyContent="space-between">
    <Box display="flex" alignItems="center">
      <Heading.h2 fontWeight="700">Whitelisted Accounts ({number})</Heading.h2>
      <Tooltip message="Whitelisted accounts may submit transactions on the network." placement="bottom" variant="dark">
        <Icon ml={3} name="InfoOutline" className={styles.infoIcon} />
      </Tooltip>
    </Box>
    <Flex alignItems="center">
      <Button icon="AddCircleOutline" mainColor="#25D78F" onClick={() => openAddModal()} disabled={disabledAdd}>
        Add Whitelisted Account
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
