// Libs
import { TableCell, TableRow } from '@material-ui/core';
import React from 'react';
// Styles
import styles from './styles.module.scss';
type EmptyRow = {
  type: string;
};
const EmptyRow: React.FC<EmptyRow> = ({ type }) => (
  <TableRow>
    <TableCell colSpan={2} className={styles.emptyLine}>
      No {type} have been added.
    </TableCell>
  </TableRow>
);

export default EmptyRow;
