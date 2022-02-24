// Libs
import React from 'react';
import PropTypes from 'prop-types';
//import { Grid, Box, Typography } from '@material-ui/core';
// Rimble Components
import { Text, Flex, Flash, Icon } from 'rimble-ui';

//import WarningIcon from '@material-ui/icons/Warning';
// Styles
import styles from './styles.module.scss';

const NoContract: React.FC<{ tabName: string }> = ({ tabName }) => (
  <Flash variant="danger">
    <Flex alignItems="center">
      <Icon name="Warning" className={styles.icon} />
      <Text>
        Unable to locate <Text.span fontWeight={'bold'}>{tabName}</Text.span> contract. Please review the Dapp
        configuration and confirm that the contract is correctly deployed.
      </Text>
    </Flex>
  </Flash>
);

NoContract.propTypes = {
  tabName: PropTypes.string.isRequired
};

export default NoContract;
