pragma solidity 0.5.9;

import "./AccountRulesListEternalStorage.sol";


contract AccountRulesList {
    event AccountAdded(
        bool accountAdded,
        address accountAddress
    );

    event AccountRemoved(
        bool accountRemoved,
        address accountAddress
    );

    AccountRulesListEternalStorage private eternalStorage;

    function setStorage(AccountRulesListEternalStorage _eternalStorage) internal {
        eternalStorage = _eternalStorage;
    }

    function upgradeVersion(address _newVersion) internal {
        eternalStorage.upgradeVersion(_newVersion);
    }

    function size() internal view returns (uint256) {
        return eternalStorage.size();
    }

    function exists(address _account) internal view returns (bool) {
        return eternalStorage.exists(_account);
    }

    function add(address _account) internal returns (bool) {
        return eternalStorage.add(_account);
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
        return eternalStorage.remove(_account);
    }

    function getByIndex(uint index) public view returns (address account) {
        return eternalStorage.getByIndex(index);
    }

    function getAccounts() public view returns (address[] memory){
        return eternalStorage.getAccounts();
    }
}
