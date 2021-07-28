pragma solidity 0.5.9;

import "./AdminList.sol";


// This class is used as a proxy to allow us to write unit tests.
// All methods in the original class are internal.
contract ExposedAdminList is AdminList {
    function _size() external view returns (uint256) {
        return size();
    }

    function _exists(address _address) external view returns (bool) {
        return exists(_address);
    }

    function _add(address _address) external returns (bool) {
        return add(_address);
    }

    function _remove(address _address) external returns (bool) {
        return remove(_address);
    }

    function _addBatch(address[] calldata _addresses) external returns (bool) {
        return addAll(_addresses);
    }
}
