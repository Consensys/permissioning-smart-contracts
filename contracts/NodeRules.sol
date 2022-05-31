pragma solidity 0.5.9;

import "./NodeRulesProxy.sol";
import "./NodeRulesList.sol";
import "./Admin.sol";


contract NodeRules is NodeRulesProxy, NodeRulesList {

    event TransactionAdded(
        bool nodeAdded,
        bytes32 enodeHigh,
        bytes32 enodeLow,
        bytes16 enodeIp,
        uint16 enodePort
    );

    event NodeRemoved(
        bool nodeRemoved,
        bytes32 enodeHigh,
        bytes32 enodeLow,
        bytes16 enodeIp,
        uint16 enodePort
    );

    // in read-only mode rules can't be added/removed
    // this will be used to protect data when upgrading contracts
    bool private readOnlyMode = false;
    // version of this contract: semver like 1.2.14 represented like 001002014
    uint private version = 3000000;

    modifier onlyOnEditMode() {
        require(!readOnlyMode, "In read only mode: rules cannot be modified");
        _;
    }

    modifier onlyAdmin() {
        address adminContractAddress = ingressContract.getContractAddress(ingressContract.ADMIN_CONTRACT());

        require(adminContractAddress != address(0), "Ingress contract must have Admin contract registered");
        require(Admin(adminContractAddress).isAuthorized(msg.sender), "Sender not authorized");
        _;
    }

    constructor (NodeIngress _nodeIngressAddress, NodeStorage _storage) public {
        setStorage(_storage);
        ingressContract = _nodeIngressAddress;
    }

    // VERSION
    function getContractVersion() external view returns (uint) {
        return version;
    }

    // READ ONLY MODE
    function isReadOnly() external view returns (bool) {
        return readOnlyMode;
    }

    function enterReadOnly() external onlyAdmin returns (bool) {
        require(readOnlyMode == false, "Already in read only mode");
        readOnlyMode = true;
        return true;
    }

    function exitReadOnly() external onlyAdmin returns (bool) {
        require(readOnlyMode == true, "Not in read only mode");
        readOnlyMode = false;
        return true;
    }

    function connectionAllowed(
        bytes32 sourceEnodeHigh,
        bytes32 sourceEnodeLow,
        bytes16 sourceEnodeIp,
        uint16 sourceEnodePort,
        bytes32 destinationEnodeHigh,
        bytes32 destinationEnodeLow,
        bytes16 destinationEnodeIp,
        uint16 destinationEnodePort
    ) external view returns (bytes32) {
        if (groupConnectionAllowed(
            sourceEnodeHigh,
            sourceEnodeLow,
            sourceEnodeIp,
            sourceEnodePort,
            destinationEnodeHigh,
            destinationEnodeLow,
            destinationEnodeIp,
            destinationEnodePort
        ))
         {
            return 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
        } else {
            return 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
        }
    }

    function addConnection(bytes32 _groupSource, bytes32 _groupDestination) public onlyAdmin onlyOnEditMode returns (bool){
        return _addConnectionAllowed(_groupSource, _groupDestination);
    }

    function removeConnection(bytes32 _groupSource, bytes32 _groupDestination) public onlyAdmin onlyOnEditMode returns (bool){
        return _removeConnection(_groupSource, _groupDestination);
    }

    function addEnode(
        bytes32 enodeHigh,
        bytes32 enodeLow,
        bytes16 ip,
        uint16 port,
        NodeType nodeType,
        bytes6 geoHash,
        string memory name,
        string memory organization,
        string memory did,
        bytes32 group
    ) public onlyAdmin onlyOnEditMode returns (bool) {
        bool added = add(enodeHigh,enodeLow, ip, port, nodeType, geoHash, name, organization, did, group);

        /*if (added) {
            triggerRulesChangeEvent(false);
        }*/
        emit TransactionAdded(
            added,
            enodeHigh,
            enodeLow,
            ip,
            port
        );

        return added;
    }

    function removeEnode(
        bytes32 enodeHigh,
        bytes32 enodeLow,
        bytes16 ip,
        uint16 port
    ) external onlyAdmin onlyOnEditMode returns (bool) {
        bool removed = remove(enodeHigh, enodeLow, ip, port);

        /*if (removed) {
            triggerRulesChangeEvent(true);
        }*/
        emit NodeRemoved(
            removed,
            enodeHigh,
            enodeLow,
            ip,
            port
        );

        return removed;
    }

    function getSize() external view returns (uint) {
        return size();
    }

    function updateStorage_NodeRules(address _newNodeRules) public onlyAdmin returns (bool){
        return _updateStorage_NodeRules(_newNodeRules);
    }

    function activateValidationEnodeIdOnly(bool _onlyUseEnodeId) external onlyAdmin onlyOnEditMode returns (bool) {
        return setValidateEnodeIdOnly(_onlyUseEnodeId);
    }
}
