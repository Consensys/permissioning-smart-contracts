// Libs
import React, { MouseEvent, useState } from 'react';
import PropTypes from 'prop-types';
// Components
import AddModal from '../../components/Modals/AddNode';
import { ModalDisplay } from '../../constants/modals';



const AddModalContainer: React.FC<{
  isOpen: boolean;
  closeModal: () => void;
  handleAdd: (enode: string,nodeType:string, nodeName:string,nodeOrganization:string ,nodeGeoHash:string , nodeDid:string) => void;
  isValid: (value: string) => { valid: boolean; msg?: string };
  display: ModalDisplay;
}> = ({ isOpen, closeModal, handleAdd, isValid, display }) => {
  const [enode, setEnode] = useState("");
  
  const [nodeType, setNodeType] = useState("Bootnode");
  const [nodeName, setNodeName] = useState("");
  const [nodeOrganization, setNodeOrganization] = useState("");
  const [nodeDid, setNodeDid] = useState("");
  const [nodeGeoHash, setNodeGeoHash] = useState("");

  const [validation, setValidation] = useState({ valid: false });

  const modifyEnode = ({ target: { value } }: { target: { value: string , } }) => {
    const validation = isValid(value);
    setEnode(value);
    setValidation(validation);
  };

  const modifyNodeType = ({ target: { value } }: { target: { value: string , } }) => {
    const validation = isValid(value);
    setNodeType(value);
    setValidation(validation);
  };
 

  const modifyNodeName = ({ target: { value } }: { target: { value: string , } }) => {
   // const validation = isValid(value);
    setNodeName(value);
    //setValidation(validation);
  };

  const modifyNodeOrganization = ({ target: { value } }: { target: { value: string , } }) => {
   // const validation = isValid(value);
    setNodeOrganization(value);
   // setValidation(validation);
  };
 
  const modifyNodeDid = ({ target: { value } }: { target: { value: string , } }) => {
    // const validation = isValid(value);
    setNodeDid(value);
    // setValidation(validation);
   };

   const modifyNodeGeoHash = ({ target: { value } }: { target: { value: string , } }) => {
    // const validation = isValid(value);
    setNodeGeoHash(value);
    // setValidation(validation);
   };

  const handleSubmit = (e: MouseEvent) => {
    e.preventDefault();
    setEnode("");
    setValidation({ valid: false });
    handleAdd(enode,nodeType, nodeName,nodeOrganization, nodeGeoHash,nodeDid);
  };

  const handleClose = (e: MouseEvent) => {
    e.preventDefault();
    setEnode("");
    setValidation({ valid: false });
    closeModal();
  };

  return (
    <AddModal
     enode={enode}
     nodeType={nodeType}
     nodeName={nodeName}
     nodeOrganization={nodeOrganization}
     nodeDid={nodeDid}
     nodeGeoHash={nodeGeoHash}
      validationResult={validation}
      modifyEnode={modifyEnode}
      modifyNodeType={modifyNodeType}
      modifyNodeName={modifyNodeName}
      modifyNodeOrganization={modifyNodeOrganization}
      modifyNodeDid={modifyNodeDid}
      modifyNodeGeoHash={modifyNodeGeoHash}
      handleSubmit={handleSubmit}
      isOpen={isOpen}
      closeModal={handleClose}
      display={display}
    />
  );
};

AddModalContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  handleAdd: PropTypes.func.isRequired,
  isValid: PropTypes.func.isRequired,
  display: PropTypes.any.isRequired
};

export default AddModalContainer;
