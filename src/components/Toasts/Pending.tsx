// Libs
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Snackbar } from '@material-ui/core';
// Styles
import styles from './styles.module.scss';

type PendingToast = {
  message: string;
  closeToast: () => void;
};

const PendingToast: React.FC<PendingToast> = ({ message, closeToast }) => (
  <Snackbar message={message} open={true} onClose={closeToast} className={styles.fadeIn} />
);

PendingToast.propTypes = {
  message: PropTypes.string.isRequired,
  closeToast: PropTypes.func.isRequired
};

export default memo(PendingToast);
