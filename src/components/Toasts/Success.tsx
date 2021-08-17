// Libs
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Snackbar } from '@material-ui/core';

type SuccessToast = {
  message: string;
  closeToast: () => void;
};

const SuccessToast: React.FC<SuccessToast> = ({ message, closeToast }) => (
  <Snackbar message={message} onClose={closeToast} />
);

SuccessToast.propTypes = {
  message: PropTypes.string.isRequired,
  closeToast: PropTypes.func.isRequired
};

export default memo(SuccessToast);
