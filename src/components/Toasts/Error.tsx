// Libs
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Snackbar } from '@material-ui/core';
// Styles
import styles from './styles.module.scss';

type ErrorToast = {
  message: string;
  secondaryMessage?: string;
  closeToast: () => void;
};

const ErrorToast: React.FC<ErrorToast> = ({ message, secondaryMessage, closeToast }) => (
  <Snackbar message={message + ' ' + secondaryMessage} open={true} onClose={closeToast} className={styles.fadeInOut} />
);

ErrorToast.propTypes = {
  message: PropTypes.string.isRequired,
  secondaryMessage: PropTypes.string,
  closeToast: PropTypes.func.isRequired
};

export default memo(ErrorToast);
