// Libs
import React from "react";
import PropTypes from "prop-types";
// Rimble Components
import { Modal, Card, Button, Flex, Box, Heading, Form, Text } from "rimble-ui";
// Styles
import styles from "./styles.module.scss";

const AddModal = ({
    input,
    validated,
    modifyInput,
    handleSubmit,
    isOpen,
    closeModal,
    display
}) => (
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
            <Form onSubmit={handleSubmit}>
                <Box p={4} mb={3}>
                    <Heading.h3>{display.heading}</Heading.h3>
                    <Text>{display.subHeading}</Text>
                    <Form.Field
                        mt={3}
                        label={display.label}
                        className={
                            input
                                ? `${
                                      validated
                                          ? styles.validField
                                          : styles.invalidField
                                  }`
                                : null
                        }
                    >
                        <Form.Input
                            width={1}
                            type="text"
                            name="input"
                            placeholder={display.inputPlaceholder}
                            value={input}
                            onChange={modifyInput}
                            className={styles.fieldInput}
                            required
                        />
                    </Form.Field>
                    <Text color="red" height="30px" fontSize="14px">
                        {!validated && input && display.errorMessage}
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
                    <Button.Outline
                        type="button"
                        mainColor="black"
                        onClick={closeModal}
                    >
                        Cancel
                    </Button.Outline>
                    <Button
                        type="submit"
                        ml={3}
                        color="white"
                        bg="pegasys"
                        hovercolor="#25D78F"
                        border={1}
                        onClick={handleSubmit}
                        disabled={!validated}
                    >
                        {display.submitText}
                    </Button>
                </Flex>
            </Form>
        </Card>
    </Modal>
);

AddModal.propTypes = {
    input: PropTypes.string.isRequired,
    validated: PropTypes.bool.isRequired,
    modifyInput: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    display: PropTypes.object.isRequired
};

export default AddModal;
