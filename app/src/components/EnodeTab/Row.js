// Libs
import React from "react";
import PropTypes from "prop-types";
// Rimble Components
import { Pill, Flex, Button } from "rimble-ui";
// Constant
import {
    PENDING_ADDITION,
    PENDING_REMOVAL,
    FAIL_ADDITION,
    FAIL_REMOVAL
} from "../../constants/transactions";
// Components
import TextWithTooltip from "./TextWithTooltip";
// Styles
import styles from "./styles.module.scss";

const EnodeRow = ({
    isAdmin,
    deleteTransaction,
    openRemoveModal,
    isReadOnly,
    enodeHigh,
    enodeLow,
    ip,
    port,
    status,
    identifier,
    pendingLock
}) => (
    <tr className={styles.row}>
        <td colSpan="2">
            <Flex alignItems="center" className={styles.tooltipFix}>
                <TextWithTooltip
                    isReadOnly={isReadOnly || (!isReadOnly && pendingLock)}
                    isAdmin={isAdmin}
                    status={status}
                    text={`${enodeHigh}${enodeLow}`}
                />
            </Flex>
        </td>
        <td>
            <Flex alignItems="center" className={styles.tooltipFix}>
                <TextWithTooltip
                    isReadOnly={isReadOnly || (!isReadOnly && pendingLock)}
                    isAdmin={isAdmin}
                    status={status}
                    text={ip}
                />
            </Flex>
        </td>
        <td>
            <Flex alignItems="center" className={styles.tooltipFix}>
                <TextWithTooltip
                    isReadOnly={isReadOnly || (!isReadOnly && pendingLock)}
                    isAdmin={isAdmin}
                    status={status}
                    text={port}
                />
            </Flex>
        </td>
        <td>
            <Flex justifyContent="space-between" alignItems="center">
                {status === "active" ? (
                    <Pill color="#018002" className={styles.pill}>
                        Active
                    </Pill>
                ) : status === PENDING_ADDITION ? (
                    <Pill color="#FFA505" className={styles.pill}>
                        Pending Addition
                    </Pill>
                ) : status === PENDING_REMOVAL ? (
                    <Pill color="#FFA505" className={styles.pill}>
                        Pending Removal
                    </Pill>
                ) : status === FAIL_ADDITION ? (
                    <Flex>
                        <Pill color="#FF1C1E" className={styles.pill}>
                            Addition Failed
                        </Pill>
                        <Pill
                            color="green"
                            ml={2}
                            className={styles.pill}
                            onClick={() => deleteTransaction(identifier)}
                        >
                            Clear
                        </Pill>
                    </Flex>
                ) : status === FAIL_REMOVAL ? (
                    <Flex>
                        <Pill color="#FF1C1E" className={styles.pill}>
                            Removal Failed
                        </Pill>
                        <Pill
                            color="green"
                            ml={2}
                            className={styles.pill}
                            onClick={() => deleteTransaction(identifier)}
                        >
                            Clear
                        </Pill>
                    </Flex>
                ) : (
                    <div />
                )}
                {isAdmin &&
                    !isReadOnly &&
                    !pendingLock &&
                    status === "active" && (
                        <Button.Text
                            mainColor="#CCC"
                            icon="Delete"
                            icononly
                            className={styles.removeIcon}
                            onClick={() => openRemoveModal(identifier)}
                        />
                    )}
            </Flex>
        </td>
    </tr>
);

EnodeRow.propTypes = {
    enodeHigh: PropTypes.string.isRequired,
    enodeLow: PropTypes.string.isRequired,
    ip: PropTypes.string.isRequired,
    port: PropTypes.string.isRequired,
    identifier: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    isReadOnly: PropTypes.bool.isRequired,
    pendingLock: PropTypes.bool.isRequired,
    deleteTransaction: PropTypes.func.isRequired
};

export default EnodeRow;
