// Libs
import React, { MouseEvent } from 'react';
import PropTypes from 'prop-types';
// Components
import ModifyModal from '../../components/Modals/Modify';
import { ModalDisplay } from '../../constants/modals';
import AccountWithPermissions from '../../components/AccountTab/AccountWithPermissions';

const ModifyModalContainer: React.FC<{
  isOpen: boolean;
  closeModal: () => void;
  handleModify: (value: any) => void;
  value: AccountWithPermissions;
  display: ModalDisplay;
}> = ({ isOpen, closeModal, handleModify, value, display }) => {
  const handleSubmit = (e: MouseEvent) => {
    e.preventDefault();
    handleModify(value);
  };

  const handleClose = (e: MouseEvent) => {
    e.preventDefault();
    closeModal();
  };

  return <ModifyModal handleSubmit={handleSubmit} isOpen={isOpen} closeModal={handleClose} display={display} />;
};

ModifyModalContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  handleModify: PropTypes.func.isRequired,
  value: PropTypes.any.isRequired,
  display: PropTypes.any.isRequired
};

export default ModifyModalContainer;
