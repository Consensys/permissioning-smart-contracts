// Libs
import React from 'react';
// Rimble Components
import { Grid } from '@material-ui/core';
// Styles
import styles from './styles.module.scss';

const AppBar: React.FC<{}> = () => (
  <Grid className={styles.appBar}>
    <h3>Besu Permissioning</h3>
  </Grid>
);

export default AppBar;
