// Libs
import React, { memo } from "react";
import PropTypes from "prop-types";
// Rimble Components
import { ToastMessage } from "rimble-ui";
// Styles
import styles from "./styles.module.scss";

const SuccessToast = ({ message, closeToast }) => (
    <ToastMessage.Success
        minWidth="300px"
        zIndex="2"
        message={message}
        closeElem
        closeFunction={closeToast}
        className={styles.fadeInOut}
    />
);

SuccessToast.propTypes = {
    message: PropTypes.string.isRequired,
    closeToast: PropTypes.func.isRequired
};

export default memo(SuccessToast);
