// Libs
import React from "react";
import PropTypes from "prop-types";
// Rimble Components
import { Modal, Card, Button, Flex, Box, Heading, Text } from "rimble-ui";
// Styles
import styles from "./styles.module.scss";

const LockModal: React.FC<{
  closeModal: (e: Event) => void
  isOpen: boolean
  handleLock: (e: Event) => void
  isReadOnly: boolean
}> = ({ closeModal, isOpen, handleLock, isReadOnly }) => (
    <Modal isOpen={isOpen}>
        <Card width={"700px"} p={0}>
            <Button.Text
                icononly
                icon={"Close"}
                mainColor={"moon-gray"}
                top={0}
                right={0}
                mt={3}
                mr={3}
                onClick={closeModal}
                className={styles.closeIcon}
            />
            <Box p={4} mb={3}>
                <Heading.h3>
                    {isReadOnly ? "Unlock and allow changes?" : "Lock values?"}
                </Heading.h3>
                <Text>
                    {isReadOnly
                        ? "Are you sure you want to allow changes"
                        : "Are you sure you want to prevent any changes?"}
                </Text>
            </Box>
            <Flex
                px={4}
                py={3}
                borderTop={1}
                borderStyle={"solid"}
                borderColor={"#E8E8E8"}
                justifyContent={"flex-end"}
            >
                <Button.Outline mainColor="black" onClick={closeModal}>
                    Cancel
                </Button.Outline>
                <Button ml={3} onClick={handleLock}>
                    {isReadOnly ? "Yes, Unlock" : "Yes, Lock"}
                </Button>
            </Flex>
        </Card>
    </Modal>
);

LockModal.propTypes = {
    closeModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    handleLock: PropTypes.func.isRequired,
    isReadOnly: PropTypes.bool.isRequired
};

export default LockModal;
