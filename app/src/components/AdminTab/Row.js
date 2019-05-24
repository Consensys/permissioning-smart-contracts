// Libs
import React from "react";
import PropTypes from "prop-types";
// Rimble Components
import { Pill, Flex, Text, Button } from "rimble-ui";
// Constant
import {
    PENDING_ADDITION,
    PENDING_REMOVAL,
    FAIL_ADDITION,
    FAIL_REMOVAL
} from "../../constants/transactions";
// Styles
import styles from "./styles.module.scss";

const AdminRow = ({
    address,
    status,
    isSelf,
    isAdmin,
    deleteTransaction,
    openRemoveModal
}) => (
    <tr className={styles.row}>
        <td>
            <Flex alignItems="center">
                {status === PENDING_REMOVAL ? (
                    <Text.s opacity="0.5" fontSize="14px">
                        {address}
                    </Text.s>
                ) : (
                    <Text fontSize="14px">{address}</Text>
                )}
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
                            onClick={() => deleteTransaction(address)}
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
                            onClick={() => deleteTransaction(address)}
                        >
                            Clear
                        </Pill>
                    </Flex>
                ) : (
                    <div />
                )}
                {!isSelf && isAdmin && status === "active" && (
                    <Button.Text
                        mainColor="#CCC"
                        icon="Delete"
                        icononly
                        className={styles.removeIcon}
                        onClick={() => openRemoveModal(address)}
                    />
                )}
            </Flex>
        </td>
    </tr>
);

AdminRow.propTypes = {
    address: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    isSelf: PropTypes.bool.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    deleteTransaction: PropTypes.func.isRequired,
    openRemoveModal: PropTypes.func.isRequired
};

export default AdminRow;
