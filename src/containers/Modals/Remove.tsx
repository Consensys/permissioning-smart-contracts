// Libs
import React, { MouseEvent } from 'react';
import PropTypes from 'prop-types';
// Components
import RemoveModal from '../../components/Modals/Remove';
import { ModalDisplay } from '../../constants/modals';

const RemoveModalContainer: React.FC<{
  isOpen: boolean;
  closeModal: () => void;
  handleRemove: (value: string | boolean) => void;
  value: string | boolean;
  display: ModalDisplay;
}> = ({ isOpen, closeModal, handleRemove, value, display }) => {
  const handleSubmit = (e: MouseEvent) => {
    e.preventDefault();
    handleRemove(value);
  };

  const handleClose = (e: MouseEvent) => {
    e.preventDefault();
    closeModal();
  };

  return <RemoveModal handleSubmit={handleSubmit} isOpen={isOpen} closeModal={handleClose} display={display} />;
};

RemoveModalContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  display: PropTypes.any.isRequired
};

export default RemoveModalContainer;
