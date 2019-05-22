// Libs
import React from "react";
import PropTypes from "prop-types";
// Components
import RemoveModal from "../../components/Modals/Remove";

const RemoveModalContainer = ({
    isOpen,
    closeModal,
    handleRemove,
    value,
    display
}) => {
    const handleSubmit = e => {
        e.preventDefault();
        handleRemove(value);
    };

    const handleClose = e => {
        e.preventDefault();
        closeModal();
    };

    return (
        <RemoveModal
            handleSubmit={handleSubmit}
            isOpen={isOpen}
            closeModal={handleClose}
            value={value}
            display={display}
        />
    );
};

RemoveModalContainer.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    handleRemove: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
    display: PropTypes.object.isRequired
};

export default RemoveModalContainer;
