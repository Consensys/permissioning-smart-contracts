pragma solidity 0.5.9;

import "./NodeStorage.sol";


contract NodeRulesList {

    // struct size = 82 bytes
    struct enode {
        string enodeId;
        string ip;
        uint16 port;
    }

    NodeStorage private nodeStorage;

    function setStorage(NodeStorage _storage) internal {
        nodeStorage = _storage;
    }

    function upgradeVersion(address _newVersion) internal {
        nodeStorage.upgradeVersion(_newVersion);
    }

    function size() internal view returns (uint256) {
        return nodeStorage.size();
    }

    function exists(string memory _enodeId, string memory _ip, uint16 _port) internal view returns (bool) {
        return nodeStorage.exists(_enodeId, _ip, _port);
    }

    function add(string memory _enodeId, string memory _ip, uint16 _port) public returns (bool) {
        return nodeStorage.add(_enodeId, _ip, _port);
    }

    function remove(string memory _enodeId, string memory _ip, uint16 _port) public returns (bool) {
        return nodeStorage.remove(_enodeId, _ip, _port);
    }

    function calculateKey(string memory _enodeId, string memory _ip, uint16 _port) public view returns(uint256) {
        return nodeStorage.calculateKey(_enodeId, _ip, _port);
    }

    function getByIndex(uint index) external view returns (string memory enodeId, string memory ip, uint16 port) {
        return nodeStorage.getByIndex(index);
    }
}
