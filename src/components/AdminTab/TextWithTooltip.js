// Libs
import React from "react";
import classnames from "classnames";
// Rimble Components
import { Tooltip, Text } from "rimble-ui";
// Constants
import {
    PENDING_ADDITION,
    PENDING_REMOVAL
} from "../../constants/transactions";
// Styles
import styles from "./styles.module.scss";

const TextWithTooltip = ({ status, isAdmin, text }) => {
    return status === PENDING_ADDITION ||
        status === PENDING_REMOVAL ||
        !isAdmin ? (
        <Tooltip
            placement="center"
            message={
                isAdmin
                    ? "This transaction is pending."
                    : "You must be an admin to perform modifications."
            }
            variant="dark"
        >
            <Text
                className={classnames(
                    styles.ellipsis,
                    status === PENDING_REMOVAL
                        ? styles.pendingRemoval
                        : status === PENDING_ADDITION
                        ? styles.pendingAddition
                        : styles.lock
                )}
                fontSize="14px"
            >
                {text}
            </Text>
        </Tooltip>
    ) : (
        <Text className={styles.ellipsis} fontSize="14px">
            {text}
        </Text>
    );
};

export default TextWithTooltip;
