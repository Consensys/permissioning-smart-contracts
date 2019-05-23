// Libs
import React from "react";
import PropTypes from "prop-types";
// Rimble Components
import { Pill, Flex, Text, Button } from "rimble-ui";
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
            <Flex alignItems="center">
                {status === "pendingRemoval" ? (
                    <Text.s
                        className={styles.ellipsis}
                        fontSize="14px"
                    >{`${enodeHigh}${enodeLow}`}</Text.s>
                ) : (
                    <Text
                        className={styles.ellipsis}
                        fontSize="14px"
                    >{`${enodeHigh}${enodeLow}`}</Text>
                )}
            </Flex>
        </td>
        <td>
            <Flex alignItems="center">
                {status === "pendingRemoval" ? (
                    <Text.s className={styles.ellipsis} fontSize="14px">
                        {ip}
                    </Text.s>
                ) : (
                    <Text className={styles.ellipsis} fontSize="14px">
                        {ip}
                    </Text>
                )}
            </Flex>
        </td>
        <td>
            <Flex alignItems="center">
                {status === "pendingRemoval" ? (
                    <Text.s className={styles.ellipsis} fontSize="14px">
                        {port}
                    </Text.s>
                ) : (
                    <Text className={styles.ellipsis} fontSize="14px">
                        {port}
                    </Text>
                )}
            </Flex>
        </td>
        <td>
            <Flex justifyContent="space-between" alignItems="center">
                {status === "active" ? (
                    <Pill color="#018002" className={styles.pill}>
                        Active
                    </Pill>
                ) : status === "pendingAddition" ? (
                    <Pill color="#FFA505" className={styles.pill}>
                        Pending Addition
                    </Pill>
                ) : status === "pendingRemoval" ? (
                    <Pill color="#FFA505" className={styles.pill}>
                        Pending Removal
                    </Pill>
                ) : status === "failAddition" ? (
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
                ) : status === "failRemoval" ? (
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
