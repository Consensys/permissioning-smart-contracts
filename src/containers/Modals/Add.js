// Libs
import React, { useState } from "react";
import PropTypes from "prop-types";
// Components
import AddModal from "../../components/Modals/Add";

const AddModalContainer = ({
    isOpen,
    closeModal,
    handleAdd,
    isValid,
    display
}) => {
    const [input, setInput] = useState("");
    const [validation, setValidation] = useState({ valid: false });

    const modifyInput = ({ target: { value } }) => {
        const validation = isValid(value);
        setInput(value);
        setValidation(validation);
    };

    const handleSubmit = e => {
        e.preventDefault();
        setInput("");
        setValidation({ valid: false });
        handleAdd(input);
    };

    const handleClose = e => {
        e.preventDefault();
        setInput("");
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
    display: PropTypes.object.isRequired
};

export default AddModalContainer;
