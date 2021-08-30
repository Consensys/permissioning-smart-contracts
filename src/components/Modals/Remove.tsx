// Libs
import React, { MouseEvent } from 'react';
import PropTypes from 'prop-types';
import { Dialog, Button, DialogTitle, DialogActions, DialogContent, DialogContentText } from '@material-ui/core';
// Styles
import { ModalDisplay } from '../../constants/modals';

const RemoveModal: React.FC<{
  closeModal: (e: MouseEvent) => void;
  isOpen: boolean;
  handleSubmit: (e: MouseEvent) => void;
  display: ModalDisplay;
}> = ({ closeModal, isOpen, handleSubmit, display }) => (
  <Dialog open={isOpen} onClose={closeModal} aria-labelledby="form-dialog-title">
    <DialogTitle id="form-dialog-title">{display.heading}</DialogTitle>
    <DialogContent>
      <DialogContentText>
        {display.subHeading} {display.label}
      </DialogContentText>
    </DialogContent>

    <DialogActions>
      <Button onClick={closeModal}>Cancel</Button>
      <Button color="primary" onClick={handleSubmit}>
        Remove
      </Button>
    </DialogActions>
  </Dialog>
);

RemoveModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  display: PropTypes.any.isRequired
};

export default RemoveModal;
