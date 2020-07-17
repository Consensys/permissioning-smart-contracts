// Libs
import React from 'react';
// Styles
import styles from './styles.module.scss';

const EmptyRow: React.FC<{}> = () => (
  <tr>
    <td colSpan={5} className={styles.emptyLine}>
      No nodes have been added.
    </td>
  </tr>
);

export default EmptyRow;
