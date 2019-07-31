import React from 'react';
import { Flex } from 'rimble-ui';
import styles from './styles.module.scss';

const Footer: React.FC<{}> = () => {
  return (
    <Flex>
      <a href="http://www.pegasys.tech" target="_blank" rel="noopener noreferrer" className={styles.footerLogo}>
        Created by PegaSys
      </a>
    </Flex>
  );
};

export default Footer;
