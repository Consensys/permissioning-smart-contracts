// Libs
import React, { memo } from 'react';
import PropTypes from 'prop-types';
// Rimble Components
import { ToastMessage } from 'rimble-ui';
// Styles
import styles from './styles.module.scss';

type PendingToast = {
  message: string;
  closeToast: () => void;
};

const PendingToast: React.FC<PendingToast> = ({ message, closeToast }) => (
  <ToastMessage.Processing
    minWidth="300px"
    zIndex="2"
    message={message}
    closeElem
    closeFunction={closeToast}
    className={styles.fadeIn}
  />
);

PendingToast.propTypes = {
  message: PropTypes.string.isRequired,
  closeToast: PropTypes.func.isRequired
};

export default memo(PendingToast);
