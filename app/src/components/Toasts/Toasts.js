// Libs
import React, { Fragment } from "react";
import PropTypes from "prop-types";
// Components
import PendingToast from "./Pending";
import ErrorToast from "./Error";
import SuccessToast from "./Success";
// Rimble Components
import { Flex } from "rimble-ui";

const Toasts = ({ toasts, closeToast }) => (
    <Flex position="absolute" bottom="50px" right="50px" flexDirection="column">
        {toasts.map(({ status, identifier, ...messages }, index) => (
            <Fragment key={index}>
                {status === "pending" && (
                    <PendingToast
                        {...messages}
                        closeToast={closeToast(identifier)}
                    />
                )}
                {status === "fail" && (
                    <ErrorToast
                        {...messages}
                        closeToast={closeToast(identifier)}
                    />
                )}
                {status === "success" && (
                    <SuccessToast
                        position="absolute"
                        bottom="0"
                        {...messages}
                        closeToast={closeToast(identifier)}
                    />
                )}
            </Fragment>
        ))}
    </Flex>
);

Toasts.propTypes = {
    toasts: PropTypes.arrayOf(PropTypes.object).isRequired,
    closeToast: PropTypes.func.isRequired
};

export default Toasts;
