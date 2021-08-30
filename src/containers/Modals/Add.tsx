// Libs
import React, { MouseEvent, useState } from 'react';
import PropTypes from 'prop-types';
// Components
import AddModal from '../../components/Modals/Add';
import { ModalDisplay } from '../../constants/modals';

const AddModalContainer: React.FC<{
  isOpen: boolean;
  closeModal: () => void;
  handleAdd: (input: string) => void;
  isValid: (value: string) => { valid: boolean; msg?: string };
  display: ModalDisplay;
}> = ({ isOpen, closeModal, handleAdd, isValid, display }) => {
  const [input, setInput] = useState('');
  const [validation, setValidation] = useState({ valid: false });

  const modifyInput = ({ target: { value } }: { target: { value: string } }) => {
    const validation = isValid(value);
    setInput(value);
    setValidation(validation);
  };

  const handleSubmit = (e: MouseEvent) => {
    e.preventDefault();
    setInput('');
    setValidation({ valid: false });
    handleAdd(input);
  };

  const handleClose = (e: MouseEvent) => {
    e.preventDefault();
    setInput('');
    setValidation({ valid: false });
    closeModal();
  };

  return (
    <AddModal
      input={input}
      validationResult={validation}
      modifyInput={modifyInput}
      handleSubmit={handleSubmit}
      isOpen={isOpen}
      closeModal={handleClose}
      display={display}
    />
  );
};

AddModalContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  handleAdd: PropTypes.func.isRequired,
  isValid: PropTypes.func.isRequired,
  display: PropTypes.any.isRequired
};

export default AddModalContainer;
