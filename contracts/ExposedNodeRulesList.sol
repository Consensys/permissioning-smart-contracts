pragma solidity 0.5.9;

import "./NodeRulesList.sol";
import "./NodeStorage.sol";


contract ExposedNodeRulesList is NodeRulesList {

    function _setStorage(NodeStorage _storage) public {
        return setStorage(_storage);
    }

    function _calculateKey(string calldata _enodeId, string calldata _host, uint16 _port) external view returns(uint256) {
        return calculateKey(_enodeId, _host, _port);
    }

    function _size() external view returns (uint256) {
        return size();
    }

    function _exists(string calldata _enodeId, string calldata _host, uint16 _port) external view returns (bool) {
        return exists(_enodeId, _host, _port);
    }

    function _add(string calldata _enodeId, string calldata _host, uint16 _port) external returns (bool) {
        return add(_enodeId, _host, _port);
    }

    function _remove(string calldata _enodeId, string calldata _host, uint16 _port) external returns (bool) {
        return remove(_enodeId, _host, _port);
    }
}
