// Libs
import React from 'react';
import PropTypes from 'prop-types';
// Rimble Components
import { Modal, Card, Button, Flex, Box, Heading, Text } from 'rimble-ui';
// Styles
import styles from './styles.module.scss';
import { ModalDisplay } from '../../constants/modals';

const RemoveModal: React.FC<{
  closeModal: (e: Event) => void;
  isOpen: boolean;
  handleSubmit: (e: Event) => void;
  display: ModalDisplay;
}> = ({ closeModal, isOpen, handleSubmit, display }) => (
  <Modal isOpen={isOpen}>
    <Card width={'700px'} p={0}>
      <Button.Text
        icononly
        icon={'Close'}
        mainColor={'moon-gray'}
        top={0}
        right={0}
        mt={3}
        mr={3}
        onClick={closeModal}
        className={styles.closeIcon}
      />
      <Box p={4} mb={3}>
        <Heading.h3>{display.heading}</Heading.h3>
        <Text className={styles.break}>{display.subHeading}</Text>
      </Box>
      <Flex px={4} py={3} borderTop={1} borderStyle={'solid'} borderColor={'#E8E8E8'} justifyContent={'flex-end'}>
        <Button.Outline mainColor="black" onClick={closeModal}>
          Cancel
        </Button.Outline>
        <Button variant="danger" ml={3} onClick={handleSubmit}>
          Remove
        </Button>
      </Flex>
    </Card>
  </Modal>
);

RemoveModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  display: PropTypes.any.isRequired
};

export default RemoveModal;
