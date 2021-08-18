// Libs
import React from 'react';
// Rimble Components
import { Grid } from '@material-ui/core';
// Styles
import styles from './styles.module.scss';

const AppBar: React.FC<{}> = () => (
  <Grid container alignItems="center" justifyContent="space-between" className={styles.appBar}>
    <h2>Besu Permissioning</h2>
  </Grid>
);

export default AppBar;
