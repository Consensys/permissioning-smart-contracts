// Libs
import React from 'react';
// Styles
import styles from './styles.module.scss';

const EmptyRow: React.FC<{}> = () => (
  <tr>
    <td colSpan={2} className={styles.emptyLine}>
      No accounts have been whitelisted.
    </td>
  </tr>
);

export default EmptyRow;
