pragma solidity 0.5.9;

import "./AccountStorage.sol";
import "./MultisignatureRelay.sol";
import "./lib/LibBytesV06.sol";

contract AccountRulesList is MultisignatureRelay {

    using LibBytesV06 for bytes;

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

    AccountStorage private accountStorage;

    function setStorage(AccountStorage _storage) internal {
        accountStorage = _storage;
    }
    
    function getStorage() public view  returns (address){
        return address(accountStorage);
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
        bytes memory _payload = abi.encodeWithSignature("addAccount(address)", _account, true);
        submitTransaction(address(accountStorage),_payload);
        return true;
    }

    /*function _addAllAccounts(address[] memory accounts) internal returns (bool) {
        bool allAdded = true;
        for (uint i = 0; i < accounts.length; i++) {
            bool added = _addNewAccount(accounts[i]);
            emit AccountAdded(added, accounts[i]);
            allAdded = allAdded && added;
        }

        return allAdded;
    }*/

    function _removeAccount(address _account) internal returns (bool) {
        bytes memory _payload = abi.encodeWithSignature("removeAccount(address)", _account, true);
        return submitTransaction(address(accountStorage), _payload);
    }

    function _addNewTarget(address _target) internal returns (bool) {
        bytes memory _payload = abi.encodeWithSignature("addTarget(address)", _target, false);
        submitTransaction(address(accountStorage), _payload);
        return true;
    }

    function _confirmTransaction(uint256 transactionId) internal returns (bool){
        confirmTransaction(transactionId);
        return true;
    }
    function _revokeConfirmation(uint256 transactionId) internal returns (bool){
        revokeConfirmation(transactionId);
        return true;
    }

    /*
    function _addAllTargets(address[] memory targets) internal returns (bool) {
        bool allAdded = true;
        for (uint i = 0; i < targets.length; i++) {
            bool added = _addNewTarget(targets[i]);
            emit TargetAdded(added, targets[i]);
            allAdded = allAdded && added;
        }

        return allAdded;
    }*/

    function _removeTarget(address _target) internal returns (bool) {
        bytes memory _payload = abi.encodeWithSignature("removeTarget(address)", _target, false);
        return submitTransaction(address(accountStorage), _payload);
    }

    function _updateStorage_AccountRules(address _newAccountRules) internal returns (bool) {
        bytes memory _payload = abi.encodeWithSignature("updateAccountRules(address)", _newAccountRules);
        return submitTransaction(address(accountStorage), _payload);
    }
    
    function getByIndex(uint index) public view returns (address account) {
        return accountStorage.getByIndex(index);
    }
    
    function getTargetByIndex(uint index) public view returns (address account) {
        return accountStorage.getTargetByIndex(index);
    }

    function getAccounts() public view returns (address[] memory){
        return accountStorage.getAccounts();
    }

    function getTargets() public view returns (address[] memory){
        return accountStorage.getTargets();
    }

    function getTransaction(uint transactionId) public view returns (address, bool, bool, uint ) {
        (bytes memory payload, bool executed) = getTransactionPayload(transactionId);
        
        (address _account_target, bool _isAccount) = abi.decode(payload.slice(4,payload.length),(address,bool));
        return (_account_target, _isAccount, executed, transactionId);
    }
}
