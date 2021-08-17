import React from 'react';
import { Grid } from '@material-ui/core';
import styles from './styles.module.scss';

const Footer: React.FC<{}> = () => {
  return (
    <Grid>
      <a href="https://consensys.net/quorum" target="_blank" rel="noopener noreferrer" className={styles.footerLogo}>
        Created by ConsenSys
      </a>
    </Grid>
  );
};

export default Footer;
