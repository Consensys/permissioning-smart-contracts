// Libs
import React, { MouseEvent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
// Rimble Components
import { Modal, Card, Button, Flex, Box, Heading, Form, Text, Select } from 'rimble-ui';
// Styles
import styles from './styles.module.scss';
import { ModalDisplay } from '../../constants/modals';

const AddModal: React.FC<{
  enode: String;
  nodeType:String;
  nodeName:String;
  nodeOrganization:String;
  nodeGeoHash:String;
  nodeDid:String;
  validationResult: { valid: boolean; msg?: string };
 
  modifyEnode: (input: { target: { name: string; value: string } }) => void;
  modifyNodeType: (input: { target: { name: string; value: string } }) => void;
  modifyNodeName: (input: { target: { name: string; value: string } }) => void;
  modifyNodeOrganization: (input: { target: { name: string; value: string } }) => void;
  modifyNodeDid: (input: { target: { name: string; value: string } }) => void;
  modifyNodeGeoHash: (input: { target: { name: string; value: string } }) => void;

  handleSubmit: (e: MouseEvent) => void;
  isOpen: boolean;
  closeModal: (e: MouseEvent) => void;
  display: ModalDisplay;
}> = ({ enode,nodeType,nodeName,nodeOrganization,nodeDid,nodeGeoHash, validationResult, modifyEnode,modifyNodeType, modifyNodeName,modifyNodeOrganization,modifyNodeDid,modifyNodeGeoHash,handleSubmit, isOpen, closeModal, display }) => (
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
      <Form onSubmit={handleSubmit}>
        <Box p={4} mb={3}>
          <Heading.h3>{display.heading}</Heading.h3>
          <Text>{display.subHeading}</Text>
          <Form.Field
            mt={3}
            label="Node Type"
           // className={nodeType ? `${validationResult.valid ? styles.validField : styles.invalidField}` : null}
          >
            <Select
              name="type"
              items={['Bootnode', 'Validator', 'Writer', 'Observer']}
              value={nodeType}
              onChange={modifyNodeType}
              className={styles.fieldInput}
              required
            />
          </Form.Field>
          <Form.Field
            mt={3}
            label="Node Name"
           // className={nodeName ? `${validationResult.valid ? styles.validField : styles.invalidField}` : null}
          >
            <Form.Input
              width={1}
              type="text"
              name="name"
              placeholder="Ex: Writer1"
              value={nodeName}
              onChange={modifyNodeName}
              className={styles.fieldInput}
              required
            />
          </Form.Field>
          <Form.Field
            mt={3}
            label={display.label}
            className={enode ? `${validationResult.valid ? styles.validField : styles.invalidField}` : null}
          >
            <Form.Input
              width={1}
              type="text"
              name="enode"
              placeholder={display.inputPlaceholder}
              value={enode}
              onChange={modifyEnode}
              className={styles.fieldInput}
              required
            />
          </Form.Field>
      
          <Form.Field
            mt={3}
            label="Organization"
            //className={nodeOrganization ? `${validationResult.valid ? styles.validField : styles.invalidField}` : null}
          >
            <Form.Input
              width={1}
              type="text"
              name="organization"
              placeholder="Ex: BIDLab"
              value={nodeOrganization}
              onChange={modifyNodeOrganization}
              className={styles.fieldInput}
              required
            />
          </Form.Field>
          <Form.Field
            mt={3}
            label="Geo Hash"
            //className={nodeDid ? `${validationResult.valid ? styles.validField : styles.invalidField}` : null}
          >
            <Form.Input
              width={1}
              type="text"
              name="geoHash"
              placeholder=""
              value={nodeGeoHash }
              onChange={modifyNodeGeoHash}
              className={styles.fieldInput}
              required
            />
          </Form.Field> 

            <Form.Field
            mt={3}
            label="Node DID"
            //className={nodeDid ? `${validationResult.valid ? styles.validField : styles.invalidField}` : null}
          >
            <Form.Input
              width={1}
              type="text"
              name="did"
              placeholder="did:ethr:lacchain:0x00000000000000000000000000000000000000"
              value={nodeDid }
              onChange={modifyNodeDid}
              className={styles.fieldInput}
              required
            />
          </Form.Field> 
          <Text
            color="red"
            height="30px"
            fontSize="14px"
            className={
              !validationResult.valid && enode ? classnames(styles.errorMessage, styles.show) : styles.errorMessage
            }
          >
            {validationResult.msg ? validationResult.msg : display.errorMessage}
          </Text>
        </Box>
        <Flex px={4} py={3} borderTop={1} borderStyle={'solid'} borderColor={'#E8E8E8'} justifyContent={'flex-end'}>
          <Button.Outline type="button" mainColor="black" onClick={closeModal}>
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
            disabled={!validationResult.valid}
          >
            {display.submitText}
          </Button>
        </Flex>
      </Form>
    </Card>
  </Modal>
);

AddModal.propTypes = {
  enode: PropTypes.any.isRequired,
  validationResult: PropTypes.any.isRequired,
  modifyEnode: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  display: PropTypes.any.isRequired
};

export default AddModal;
