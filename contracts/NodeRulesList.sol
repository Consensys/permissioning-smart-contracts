pragma solidity 0.5.9;

import "./NodeRulesListEternalStorage.sol";


contract NodeRulesList {

    // struct size = 82 bytes
    struct enode {
        string enodeId;
        string ip;
        uint16 port;
    }

    NodeRulesListEternalStorage private eternalStorage;

    function setStorage(NodeRulesListEternalStorage _eternalStorage) internal {
        eternalStorage = _eternalStorage;
    }

    function upgradeVersion(address _newVersion) internal {
        eternalStorage.upgradeVersion(_newVersion);
    }

    function size() internal view returns (uint256) {
        return eternalStorage.size();
    }

    function exists(string memory _enodeId, string memory _ip, uint16 _port) internal view returns (bool) {
        return eternalStorage.exists(_enodeId, _ip, _port);
    }

    function add(string memory _enodeId, string memory _ip, uint16 _port) public returns (bool) {
        return eternalStorage.add(_enodeId, _ip, _port);
    }

    function remove(string memory _enodeId, string memory _ip, uint16 _port) public returns (bool) {
        return eternalStorage.remove(_enodeId, _ip, _port);
    }

    function calculateKey(string memory _enodeId, string memory _ip, uint16 _port) public view returns(uint256) {
        return eternalStorage.calculateKey(_enodeId, _ip, _port);
    }
}
