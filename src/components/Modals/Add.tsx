// Libs
import React, { MouseEvent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  Dialog,
  Button,
  DialogTitle,
  TextField,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography
} from '@material-ui/core';
// Styles
import styles from './styles.module.scss';
import { ModalDisplay } from '../../constants/modals';

const AddModal: React.FC<{
  input: string;
  validationResult: { valid: boolean; msg?: string };
  modifyInput: (input: { target: { value: string } }) => void;
  handleSubmit: (e: MouseEvent) => void;
  isOpen: boolean;
  closeModal: (e: MouseEvent) => void;
  display: ModalDisplay;
}> = ({ input, validationResult, modifyInput, handleSubmit, isOpen, closeModal, display }) => (
  <Dialog open={isOpen} onClose={closeModal} aria-labelledby="form-dialog-title">
    <DialogTitle id="form-dialog-title">{display.heading}</DialogTitle>
    <DialogContent>
      <DialogContentText>
        {display.subHeading}
        {display.label}
      </DialogContentText>
      <TextField
        autoFocus
        placeholder={display.inputPlaceholder}
        value={input}
        onChange={modifyInput}
        className={styles.fieldInput}
        required
        fullWidth
      />
      <Typography
        gutterBottom
        className={
          !validationResult.valid && input ? classnames(styles.errorMessage, styles.show) : styles.errorMessage
        }
      >
        {validationResult.msg ? validationResult.msg : display.errorMessage}
      </Typography>
    </DialogContent>

    <DialogActions>
      <Button onClick={closeModal}>Cancel</Button>
      <Button disabled={!validationResult.valid} color="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </DialogActions>
  </Dialog>
);

AddModal.propTypes = {
  input: PropTypes.string.isRequired,
  validationResult: PropTypes.any.isRequired,
  modifyInput: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  display: PropTypes.any.isRequired
};

export default AddModal;
