pragma solidity 0.5.9;

import "./NodeRulesProxy.sol";
import "./NodeRulesList.sol";
import "./NodeIngress.sol";
import "./Admin.sol";


contract NodeRules is NodeRulesProxy, NodeRulesList {

    event NodeAdded(
        bool nodeAdded,
        string enodeId,
        string enodeIp,
        uint16 enodePort
    );

    event NodeRemoved(
        bool nodeRemoved,
        string enodeId,
        string enodeIp,
        uint16 enodePort
    );

    // in read-only mode rules can't be added/removed
    // this will be used to protect data when upgrading contracts
    bool readOnlyMode = false;
    // version of this contract: semver like 1.2.14 represented like 001002014
    uint version = 1000000;

    NodeIngress private nodeIngressContract;

    modifier onlyOnEditMode() {
        require(!readOnlyMode, "In read only mode: rules cannot be modified");
        _;
    }

    modifier onlyAdmin() {
        address adminContractAddress = nodeIngressContract.getContractAddress(nodeIngressContract.ADMIN_CONTRACT());

        require(adminContractAddress != address(0), "Ingress contract must have Admin contract registered");
        require(Admin(adminContractAddress).isAuthorized(msg.sender), "Sender not authorized");
        _;
    }

    constructor (NodeIngress _nodeIngressAddress) public {
        nodeIngressContract = _nodeIngressAddress;
    }

    // VERSION
    function getContractVersion() public view returns (uint) {
        return version;
    }

    // READ ONLY MODE
    function isReadOnly() public view returns (bool) {
        return readOnlyMode;
    }

    function enterReadOnly() public onlyAdmin returns (bool) {
        require(readOnlyMode == false, "Already in read only mode");
        readOnlyMode = true;
        return true;
    }

    function exitReadOnly() public onlyAdmin returns (bool) {
        require(readOnlyMode == true, "Not in read only mode");
        readOnlyMode = false;
        return true;
    }

    function connectionAllowed(
        string memory enodeId,
        string memory enodeIp,
        uint16 enodePort
    ) public view returns (bool) {
        return
            enodePermitted (
                enodeId,
                enodeIp,
                enodePort
            );
    }

    function enodePermitted(
        string memory enodeId,
        string memory ip,
        uint16 port
    ) public view returns (bool) {
        return exists(enodeId, ip, port);
    }

    function addEnode(
        string memory enodeId,
        string memory ip,
        uint16 port
    ) public onlyAdmin onlyOnEditMode returns (bool) {
        bool added = add(enodeId, ip, port);

        if (added) {
            triggerRulesChangeEvent(false);
        }
        emit NodeAdded(
            added,
            enodeId,
            ip,
            port
        );

        return added;
    }

    function removeEnode(
        string memory enodeId,
        string memory ip,
        uint16 port
    ) public onlyAdmin onlyOnEditMode returns (bool) {
        bool removed = remove(enodeId, ip, port);

        if (removed) {
            triggerRulesChangeEvent(true);
        }
        emit NodeRemoved(
            removed,
            enodeId,
            ip,
            port
        );

        return removed;
    }

    function getSize() public view returns (uint) {
        return size();
    }

    function getByIndex(uint index) public view returns (string memory enodeId, string memory ip, uint16 port) {
        if (index >= 0 && index < size()) {
            enode memory item = allowlist[index];
            return (item.enodeId, item.ip, item.port);
        }
    }

    function triggerRulesChangeEvent(bool addsRestrictions) public {
        nodeIngressContract.emitRulesChangeEvent(addsRestrictions);
    }
}
