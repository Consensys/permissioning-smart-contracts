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
    const [validated, setValidated] = useState(false);

    const modifyInput = ({ target: { value } }) => {
        const validated = isValid(value);
        setInput(value);
        setValidated(validated);
    };

    const handleSubmit = e => {
        e.preventDefault();
        setInput("");
        setValidated(false);
        handleAdd(input);
    };

    const handleClose = e => {
        e.preventDefault();
        setInput("");
        setValidated(false);
        closeModal();
    };

    return (
        <AddModal
            input={input}
            validated={validated}
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
