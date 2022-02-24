// Libs
import React, { memo } from 'react';
import PropTypes from 'prop-types';
//import { Snackbar } from '@material-ui/core';

// Rimble Components
import { ToastMessage } from 'rimble-ui';

// Styles
import styles from './styles.module.scss';

type SuccessToast = {
  message: string;
  closeToast: () => void;
};

const SuccessToast: React.FC<SuccessToast> = ({ message, closeToast }) => (
  <ToastMessage.Success
    bottom="0"
    postition="absolute"
    minWidth="300px"
    zIndex="2"
    message={message}
    closeElem
    closeFunction={closeToast}
    className={styles.fadeInOut}
  />
);

SuccessToast.propTypes = {
  message: PropTypes.string.isRequired,
  closeToast: PropTypes.func.isRequired
};

export default memo(SuccessToast);
