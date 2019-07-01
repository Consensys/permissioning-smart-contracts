// Libs
import React, { memo } from "react";
import PropTypes from "prop-types";
// Rimble Components
import { ToastMessage } from "rimble-ui";
// Styles
import styles from "./styles.module.scss";

type ErrorToast = {
  message: string
  secondaryMessage?: string
  closeToast: () => void
}

const ErrorToast: React.FC<ErrorToast> = ({ message, secondaryMessage, closeToast }) => (
    <ToastMessage.Failure
        minWidth="300px"
        zIndex="2"
        message={message}
        secondaryMessage={secondaryMessage}
        closeElem
        closeFunction={closeToast}
        className={styles.fadeInOut}
    />
);

ErrorToast.propTypes = {
    message: PropTypes.string.isRequired,
    secondaryMessage: PropTypes.string,
    closeToast: PropTypes.func.isRequired
};

export default memo(ErrorToast);
