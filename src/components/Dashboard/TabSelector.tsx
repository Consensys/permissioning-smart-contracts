// Libs
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Grid, Box, Typography } from '@material-ui/core';
// Constants
import tabs from '../../constants/tabs';
// Styles
import styles from './styles.module.scss';

type TabSelector = {
  tab: string;
  setTab: (tab: string) => void;
};

const TabSelector: React.FC<TabSelector> = ({ tab, setTab }) => (
  <Grid container className={styles.choicesContainer}>
    {tabs.map(({ id, text }) => (
      <Box
        key={id}
        className={tab === id ? `${styles.selected} ${styles.choiceBox}` : styles.choiceBox}
        width="200px"
        px={3}
        onClick={() => setTab(id)}
      >
        <Typography variant="subtitle1">{text}</Typography>
      </Box>
    ))}
  </Grid>
);

TabSelector.propTypes = {
  setTab: PropTypes.func.isRequired,
  tab: PropTypes.string.isRequired
};

export default memo(TabSelector);
