pragma solidity 0.5.9;

import "./NodeStorageMultiSig.sol";
import "./Types.sol";

contract NodeRulesList is Types{

    NodeStorageMultiSig private nodeStorage;

    function setStorage(NodeStorageMultiSig _storage) internal {
        nodeStorage = _storage;
    }

    function upgradeVersion(address _newVersion) internal {
        nodeStorage.upgradeVersion(_newVersion);
    }

    function size() internal view returns (uint256) {
        return nodeStorage.size();
    }

    function exists(bytes32 _enodeHigh, bytes32 _enodeLow, bytes16 _ip, uint16 _port) internal view returns (bool) {
        return nodeStorage.exists(_enodeHigh, _enodeLow, _ip, _port);
    }

    function groupConnectionAllowed(
        bytes32 _sourceEnodeHigh,
        bytes32 _sourceEnodeLow,
        bytes16 _sourceEnodeIp,
        uint16 _sourceEnodePort,
        bytes32 _destinationEnodeHigh,
        bytes32 _destinationEnodeLow,
        bytes16 _destinationEnodeIp,
        uint16 _destinationEnodePort) internal view returns (bool){
            return nodeStorage.groupConnectionAllowed(_sourceEnodeHigh, _sourceEnodeLow, _sourceEnodeIp,_sourceEnodePort,_destinationEnodeHigh,_destinationEnodeLow,_destinationEnodeIp,_destinationEnodePort);
        }

    function _addConnectionAllowed(bytes32 _groupSource, bytes32 _groupDestination) internal returns (bool){
        return nodeStorage.addConnectionAllowed(_groupSource, _groupDestination);
    }

    function _removeConnection(bytes32 _groupSource, bytes32 _groupDestination) internal returns (bool){
        return nodeStorage.removeConnection(_groupSource,_groupDestination);
    }

    function add(bytes32 _enodeHigh, bytes32 _enodeLow, bytes16 _ip, uint16 _port, NodeType _nodeType, bytes6 _geoHash, string memory _name, string memory _organization, string memory _did, bytes32 _group) internal returns (bool) {
        nodeStorage.submitTransaction(msg.sender,_enodeHigh, _enodeLow, _ip, _port, _nodeType, _geoHash, _name, _organization, _did, _group);
        return true;
    }

    function remove(bytes32 _enodeHigh, bytes32 _enodeLow, bytes16 _ip, uint16 _port) internal returns (bool) {
        return nodeStorage.remove(_enodeHigh, _enodeLow , _ip, _port);
    }

    function _confirmTransaction(uint256 transactionId) internal returns (bool){
        nodeStorage.confirmTransaction(msg.sender, transactionId);
        return true;
    }

    function calculateKey(bytes32 _enodeHigh, bytes32 _enodeLow, bytes16 _ip, uint16 _port) public view returns(uint256) {
        return nodeStorage.calculateKey(_enodeHigh, _enodeLow , _ip, _port);
    }

    function getByIndex(uint index) external view returns (bytes32 enodeHigh, bytes32 enodeLow, bytes16 ip, uint16 port, NodeType nodeType, bytes6 geoHash, string memory name, string memory organization, string memory did, bytes32 group) {
        return nodeStorage.getByIndex(index);
    }

    function setValidateEnodeIdOnly(bool _onlyUseEnodeId) internal returns (bool) {
        return nodeStorage.setValidateEnodeIdOnly(_onlyUseEnodeId);
    }
}
