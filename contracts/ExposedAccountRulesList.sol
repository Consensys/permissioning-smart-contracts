pragma solidity >=0.4.22 <0.6.0;

import "./AccountRulesList.sol";


contract ExposedAccountRulesList is AccountRulesList {

    function _calculateKey(address _account) public pure returns(uint256) {
        return calculateKey(_account);
    }

    function _size() public view returns (uint256) {
        return size();
    }

    function _exists(address _account) public view returns (bool) {
        return exists(_account);
    }

    function _add(address _account) public returns (bool) {
        return add(_account);
    }

    function _addAll(address[] memory accounts) public returns (bool) {
        return addAll(accounts);
    }

    function _remove(address _account) public returns (bool) {
        return remove(_account);
    }

    function _get(uint _index) public view returns (bool _found, address _account) {
        return get(_index);
    }

    function _getAll() public view returns (address[] memory) {
        return getAll();
    }
}