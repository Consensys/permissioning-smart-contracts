// Libs
import React from 'react';
import { Grid, Typography } from '@material-ui/core';
// Styles
import styles from './styles.module.scss';

const AppBar: React.FC<{}> = () => (
  <Grid container alignItems="center" justifyContent="space-between" className={styles.appBar}>
    <Typography variant="h1">Besu Permissioning</Typography>
  </Grid>
);

export default AppBar;
