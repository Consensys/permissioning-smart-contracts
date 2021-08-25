// Libs
import { TableCell, TableRow } from '@material-ui/core';
import React from 'react';
// Styles
import styles from './styles.module.scss';

const EmptyRow: React.FC<{}> = () => (
  <TableRow>
    <TableCell colSpan={2} className={styles.emptyLine}>
      No accounts have been added.
    </TableCell>
  </TableRow>
);

export default EmptyRow;
