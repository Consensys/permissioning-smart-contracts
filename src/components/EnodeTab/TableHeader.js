// Libs
import React from "react";
import PropTypes from "prop-types";
// Rimble Components
import { Flex, Box, Heading, Button, Tooltip } from "rimble-ui";
// Styles
import styles from "./styles.module.scss";

const TableHeader = ({
    number,
    openAddModal,
    disabledAdd,
    openLockModal,
    disabledLock,
    pendingLock,
    isReadOnly
}) => (
    <Flex alignItems="center" justifyContent="space-between">
        <Box>
            <Heading.h2 fontWeight="700">
                Whitelisted Nodes ({number})
            </Heading.h2>
        </Box>
        <Flex alignItems="center">
            <Button
                mr={3}
                icon="AddCircleOutline"
                mainColor="#25D78F"
                onClick={() => openAddModal()}
                disabled={disabledAdd}
            >
                Add Whitelisted Node
            </Button>
            {!isReadOnly && !pendingLock && (
                <Tooltip
                    message="Prevent any changes to the contracts."
                    placement="bottom"
                    variant="dark"
                >
                    <Button.Outline
                        icon="LockOpen"
                        mainColor="black"
                        onClick={() => openLockModal()}
                        disabled={disabledLock}
                        className={styles.lockButton}
                    >
                        Lock Values
                    </Button.Outline>
                </Tooltip>
            )}
            {isReadOnly && !pendingLock && (
                <Tooltip
                    message="Unlock to make changes."
                    placement="bottom"
                    variant="dark"
                >
                    <Button
                        variant="danger"
                        icon="Lock"
                        onClick={() => openLockModal()}
                        disabled={disabledLock}
                    >
                        Allow Changes
                    </Button>
                </Tooltip>
            )}
            {isReadOnly && pendingLock && (
                <Button variant="danger" disabled>
                    Unlocking changes...
                </Button>
            )}
            {!isReadOnly && pendingLock && (
                <Button variant="danger" disabled>
                    Locking values...
                </Button>
            )}
        </Flex>
    </Flex>
);

TableHeader.propTypes = {
    number: PropTypes.number.isRequired,
    openAddModal: PropTypes.func.isRequired,
    disabledAdd: PropTypes.bool.isRequired,
    openLockModal: PropTypes.func.isRequired,
    disabledLock: PropTypes.bool.isRequired,
    pendingLock: PropTypes.bool.isRequired,
    isReadOnly: PropTypes.bool.isRequired
};

export default TableHeader;
