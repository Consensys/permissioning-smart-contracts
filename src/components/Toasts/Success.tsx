// Libs
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Snackbar } from '@material-ui/core';
// Styles
import styles from './styles.module.scss';

type SuccessToast = {
  message: string;
  closeToast: () => void;
};

const SuccessToast: React.FC<SuccessToast> = ({ message, closeToast }) => (
  <Snackbar message={message} open={true} onClose={closeToast} className={styles.fadeInOut} />
);

SuccessToast.propTypes = {
  message: PropTypes.string.isRequired,
  closeToast: PropTypes.func.isRequired
};

export default memo(SuccessToast);
