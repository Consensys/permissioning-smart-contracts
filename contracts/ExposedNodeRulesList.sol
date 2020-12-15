pragma solidity 0.5.9;

import "./NodeRulesList.sol";


contract ExposedNodeRulesList is NodeRulesList {

    function _calculateKey(string memory _enodeId, string memory _ip, uint16 _port) public pure returns(uint256) {
        return calculateKey(_enodeId, _ip, _port);
    }

    function _size() public view returns (uint256) {
        return size();
    }

    function _exists(string memory _enodeId, string memory _ip, uint16 _port) public view returns (bool) {
        return exists(_enodeId, _ip, _port);
    }

    function _add(string memory _enodeId, string memory _ip, uint16 _port) public returns (bool) {
        return add(_enodeId, _ip, _port);
    }

    function _remove(string memory _enodeId, string memory _ip, uint16 _port) public returns (bool) {
        return remove(_enodeId, _ip, _port);
    }
}
