pragma solidity >=0.4.22 <0.6.0;

import "./AdminList.sol";


// This class is used as a proxy to allow us to write unit tests.
// All methods in the original class are internal.
contract ExposedAdminList is AdminList {
    function _size() public view returns (uint256) {
        return size();
    }

    function _exists(address _address) public view returns (bool) {
        return exists(_address);
    }

    function _add(address _address) public returns (bool) {
        return add(_address);
    }

    function _remove(address _address) public returns (bool) {
        return remove(_address);
    }

    function _addBatch(address[] memory _addresses) public returns (bool) {
        return addAll(_addresses);
    }
}
