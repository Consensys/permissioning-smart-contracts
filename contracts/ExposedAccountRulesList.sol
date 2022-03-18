pragma solidity 0.5.9;

import "./AccountRulesList.sol";
import "./AccountStorage.sol";


contract ExposedAccountRulesList is AccountRulesList {

    function _setStorage(AccountStorage _storage) public {
        return setStorage(_storage);
    }

    function _size() external view returns (uint256) {
        return _sizeAccounts();
    }

    function _exists(address _account) external view returns (bool) {
        return existsAccount(_account);
    }

    function _add(address _account) external returns (bool) {
        return _addNewAccount(_account);
    }

/*    function _addAll(address[] calldata accounts) external returns (bool) {
        return _addAllAccounts(accounts);
    }*/

    function _remove(address _account) external returns (bool) {
        return _removeAccount(_account);
    }
}
