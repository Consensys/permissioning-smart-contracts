import React from 'react';
import { Flex } from 'rimble-ui';
import styles from './styles.module.scss';

const Footer: React.FC<{}> = () => {
  return (
    <Flex>
      <a href="https://consensys.net/quorum" target="_blank" rel="noopener noreferrer" className={styles.footerLogo}>
        Created by ConsenSys
      </a>
    </Flex>
  );
};

export default Footer;
