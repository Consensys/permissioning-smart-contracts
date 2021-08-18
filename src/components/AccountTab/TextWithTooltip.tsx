// Libs
import React from 'react';
import classnames from 'classnames';

import { Tooltip } from '@material-ui/core';
// Constants
import { PENDING_ADDITION, PENDING_REMOVAL } from '../../constants/transactions';
// Styles
import styles from './styles.module.scss';

type TextWithTooltip = {
  status: string;
  isAdmin: boolean;
  text: string;
};

const TextWithTooltip: React.FC<TextWithTooltip> = ({ status, isAdmin, text }) => {
  return status === PENDING_ADDITION || status === PENDING_REMOVAL || !isAdmin ? (
    <Tooltip
      placement="bottom"
      title={isAdmin ? 'This transaction is pending.' : 'You must be an admin to perform modifications.'}
    >
      <p
        className={classnames(
          styles.ellipsis,
          status === PENDING_REMOVAL
            ? styles.pendingRemoval
            : status === PENDING_ADDITION
            ? styles.pendingAddition
            : styles.lock
        )}
      >
        {text}
      </p>
    </Tooltip>
  ) : (
    <p className={styles.ellipsis}>{text}</p>
  );
};

export default TextWithTooltip;
