// Libs
import React from 'react';
import classnames from 'classnames';
import { Tooltip, Typography } from '@material-ui/core';
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
      title={isAdmin ? 'This transaction is pending.' : 'You must be an admin to perform modifications.'}
      placement="bottom"
    >
      <Typography
        variant="body1"
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
      </Typography>
    </Tooltip>
  ) : (
    <Tooltip title={text} placement="bottom">
      <Typography variant="body1" className={styles.ellipsis}>
        {text}
      </Typography>
    </Tooltip>
  );
};

export default TextWithTooltip;
