// Libs
import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Components
import AddModal from '../../components/Modals/AddNode';
import { ModalDisplay } from '../../constants/modals';

const AddNodeModalContainer: React.FC<{
  isOpen: boolean;
  closeModal: () => void;
  handleAdd: (node: any) => void;
  isValid: (value: string) => { valid: boolean; msg?: string };
  display: ModalDisplay;
}> = ({ isOpen, closeModal, handleAdd, isValid, display }) => {
  const [node, setNode] = useState({
    name: '',
    type: 'Writer',
    enode: '',
    organization: ''
  });
  const [validation, setValidation] = useState({ valid: false });

  const modifyInput = ({ target: { name, value } }: { target: { name: string; value: string } }) => {
    setNode({ ...node, [name]: value });
    //if (name === 'enode') {
    const validation = isValid(node.enode);
    setValidation(validation);
    //}
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    setNode({
      name: '',
      type: 'Writer',
      enode: '',
      organization: ''
    });
    setValidation({ valid: false });
    handleAdd(node);
  };

  const handleClose = (e: Event) => {
    e.preventDefault();
    setNode({
      name: '',
      type: 'Writer',
      enode: '',
      organization: ''
    });
    setValidation({ valid: false });
    closeModal();
  };

  return (
    <AddModal
      node={node}
      validationResult={validation}
      modifyInput={modifyInput}
      handleSubmit={handleSubmit}
      isOpen={isOpen}
      closeModal={handleClose}
      display={display}
    />
  );
};

AddNodeModalContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  handleAdd: PropTypes.func.isRequired,
  isValid: PropTypes.func.isRequired,
  display: PropTypes.any.isRequired
};

export default AddNodeModalContainer;
