pragma solidity 0.5.9;

import "./AccountStorage.sol";


contract AccountRulesList {
    event AccountAdded(
        bool accountAdded,
        address accountAddress
    );

    event AccountRemoved(
        bool accountRemoved,
        address accountAddress
    );

    AccountStorage private accountStorage;

    function setStorage(AccountStorage _storage) internal {
        accountStorage = _storage;
    }

    function upgradeVersion(address _newVersion) internal {
        accountStorage.upgradeVersion(_newVersion);
    }

    function size() internal view returns (uint256) {
        return accountStorage.size();
    }

    function exists(address _account) internal view returns (bool) {
        return accountStorage.exists(_account);
    }

    function setCanCreateContracts(address _account, bool _allowed) internal returns (bool) {
        return accountStorage.setCanCreateContract(_account, _allowed);
    }

    function getCanCreateContracts(address _account) internal view returns (bool) {
        return accountStorage.getCanCreateContract(_account);
    }

    function add(address _account) internal returns (bool) {
        return accountStorage.add(_account);
    }

    function addAll(address[] memory accounts) internal returns (bool) {
        bool allAdded = true;
        for (uint i = 0; i < accounts.length; i++) {
            bool added = add(accounts[i]);
            emit AccountAdded(added, accounts[i]);
            allAdded = allAdded && added;
        }

        return allAdded;
    }

    function remove(address _account) internal returns (bool) {
        return accountStorage.remove(_account);
    }

    function getByIndex(uint index) public view returns (address account) {
        return accountStorage.getByIndex(index);
    }

    // TODO does this make sense... how do we do this in an extensible way
    function getByIndexWithExtraPermissions(uint index) public view returns (address account, bool canCreateContracts) {
        return (accountStorage.getByIndex(index), getCanCreateContracts(account));
    }

    function getAccounts() public view returns (address[] memory){
        return accountStorage.getAccounts();
    }
}
