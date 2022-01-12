pragma solidity 0.5.9;

import "./AccountStorageMultiSig.sol";


contract AccountRulesList {
    event AccountAdded(
        bool accountAdded,
        address accountAddress
    );

    event AccountRemoved(
        bool accountRemoved,
        address accountAddress
    );

    event TargetAdded(
        bool targetAdded,
        address accountAddress
    );

    event TargetRemoved(
        bool targetRemoved,
        address accountAddress
    );

    event RelayHubSet(
        address newRelayHub
    );

    AccountStorageMultiSig private accountStorage;

    function setStorage(AccountStorageMultiSig _storage) internal {
        accountStorage = _storage;
    }

    function upgradeVersion(address _newVersion) internal {
        accountStorage.upgradeVersion(_newVersion);
    }

    function _sizeAccounts() internal view returns (uint256) {
        return accountStorage.sizeAccounts();
    }

    function _sizeTargets() internal view returns (uint256) {
        return accountStorage.sizeTargets();
    }

    function existsAccount(address _account) internal view returns (bool) {
        return accountStorage.existsAccount(_account);
    }

    function existsTarget(address _target) internal view returns (bool) {
        return accountStorage.existsTarget(_target);
    }

    function _addNewAccount(address _account) internal returns (bool) {
        accountStorage.submitTransaction(msg.sender,_account,true);
        return true;
    }

    function _addAllAccounts(address[] memory accounts) internal returns (bool) {
        bool allAdded = true;
        for (uint i = 0; i < accounts.length; i++) {
            bool added = _addNewAccount(accounts[i]);
            emit AccountAdded(added, accounts[i]);
            allAdded = allAdded && added;
        }

        return allAdded;
    }

    function _removeAccount(address _account) internal returns (bool) {
        return accountStorage.removeAccount(_account);
    }

    function _addNewTarget(address _target) internal returns (bool) {
        accountStorage.submitTransaction(msg.sender,_target,false);
        return true;
    }

    function _confirmTransaction(uint256 transactionId) internal returns (bool){
        accountStorage.confirmTransaction(msg.sender, transactionId);
        return true;
    }

    function _addAllTargets(address[] memory targets) internal returns (bool) {
        bool allAdded = true;
        for (uint i = 0; i < targets.length; i++) {
            bool added = _addNewTarget(targets[i]);
            emit TargetAdded(added, targets[i]);
            allAdded = allAdded && added;
        }

        return allAdded;
    }

    function _removeTarget(address _target) internal returns (bool) {
        return accountStorage.removeTarget(_target);
    }

    function getByIndex(uint index) public view returns (address account) {
        return accountStorage.getByIndex(index);
    }

    function getAccounts() public view returns (address[] memory){
        return accountStorage.getAccounts();
    }

    function getTargets() public view returns (address[] memory){
        return accountStorage.getTargets();
    }
}
