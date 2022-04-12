pragma solidity 0.5.9;

import "./NodeStorage.sol";
import "./Types.sol";
import "./MultisignatureRelay.sol";
import "./lib/LibBytesV06.sol";

contract NodeRulesList is MultisignatureRelay, Types{

    using LibBytesV06 for bytes;

    NodeStorage private nodeStorage;

    function setStorage(NodeStorage _storage) internal {
        nodeStorage = _storage;
    }

    function getStorage() public view  returns (address){
        return address(nodeStorage);
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
        bytes memory _payload = abi.encodeWithSignature("addConnectionAllowed(bytes32,bytes32)", _groupSource, _groupDestination, true);
        return submitTransaction(address(nodeStorage), _payload);
    }

    function _removeConnection(bytes32 _groupSource, bytes32 _groupDestination) internal returns (bool){
        bytes memory _payload = abi.encodeWithSignature("removeConnection(bytes32,bytes32)", _groupSource, _groupDestination, false);
        return submitTransaction(address(nodeStorage), _payload);
    }

    function add(bytes32 _enodeHigh, bytes32 _enodeLow, bytes16 _ip, uint16 _port, NodeType _nodeType, bytes6 _geoHash, string memory _name, string memory _organization, string memory _did, bytes32 _group) internal returns (bool) {
        bytes memory _payload = abi.encodeWithSignature("add(bytes32,bytes32,bytes16,uint16,uint8,bytes6,string,string,string,bytes32)", _enodeHigh, _enodeLow, _ip, _port, _nodeType, _geoHash, _name, _organization, _did, _group, true);
        return submitTransaction(address(nodeStorage), _payload);
    }

    function remove(bytes32 _enodeHigh, bytes32 _enodeLow, bytes16 _ip, uint16 _port) internal returns (bool) {
        bytes memory _payload = abi.encodeWithSignature("remove(bytes32,bytes32,bytes16,uint16)",_enodeHigh, _enodeLow , _ip, _port, false);
        return submitTransaction(address(nodeStorage), _payload);
    }

    function _updateStorage_NodeRules(address _newNodeRules) internal returns (bool) {
        bytes memory _payload = abi.encodeWithSignature("updateNodeRules(address)", _newNodeRules);
        return submitTransaction(address(nodeStorage), _payload);
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

    function getTransaction(uint transactionId) public view returns (bytes memory,bool,uint ){
        (bytes memory payload, bool executed) = getTransactionPayload(transactionId);
        //return abi.decode(payload.slice(4,payload.length),(bytes32,bytes32,bytes16,uint16,NodeType,bytes6,string,string,string,bytes32));
        //{
        //    (enodeHigh, enodeLow, ip, port, nodeType, , name, organization,,) = abi.decode(payload.slice(4,payload.length),(bytes32,bytes32,bytes16,uint16,NodeType,bytes6,string,string,string,bytes32));
        //}
        //return (enodeHigh, enodeLow, ip, port, nodeType, geoHash, name, organization, did, group, transactionId, executed );
        return (payload, executed, transactionId);
    }
}
