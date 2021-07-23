pragma solidity 0.5.9;

import "./AccountRulesProxy.sol";
import "./AccountRulesList.sol";
import "./AccountIngress.sol";
import "./Admin.sol";


contract AccountRules is AccountRulesProxy, AccountRulesList {

    // in read-only mode rules can't be added/removed
    // this will be used to protect data when upgrading contracts
    bool private readOnlyMode = false;
    // version of this contract: semver like 1.2.14 represented like 001002014
    uint private version = 1000000;

    AccountIngress private ingressContract;

    modifier onlyOnEditMode() {
        require(!readOnlyMode, "In read only mode: rules cannot be modified");
        _;
    }

    modifier onlyAdmin() {
        address adminContractAddress = ingressContract.getContractAddress(ingressContract.ADMIN_CONTRACT());

        require(adminContractAddress != address(0), "Ingress contract must have Admin contract registered");
        require(Admin(adminContractAddress).isAuthorized(msg.sender), "Sender not authorized");
        _;
    }

    constructor (AccountIngress _ingressContract) public {
        ingressContract = _ingressContract;
        add(msg.sender);
    }

    // VERSION
    function getContractVersion() external view returns (uint) {
        return version;
    }

    // READ ONLY MODE
    function isReadOnly() external view returns (bool) {
        return readOnlyMode;
    }

    function enterReadOnly() external onlyAdmin returns (bool) {
        require(readOnlyMode == false, "Already in read only mode");
        readOnlyMode = true;
        return true;
    }

    function exitReadOnly() external onlyAdmin returns (bool) {
        require(readOnlyMode == true, "Not in read only mode");
        readOnlyMode = false;
        return true;
    }

    function transactionAllowed(
        address sender,
        address, // target
        uint256, // value
        uint256, // gasPrice
        uint256, // gasLimit
        bytes calldata // payload
    ) external view returns (bool) {
        if (
            accountPermitted (sender)
        ) {
            return true;
        } else {
            return false;
        }
    }

    function accountPermitted(
        address _account
    ) public view returns (bool) {
        return exists(_account);
    }

    function addAccount(
        address account
    ) external onlyAdmin onlyOnEditMode returns (bool) {
        bool added = add(account);
        emit AccountAdded(added, account);
        return added;
    }

    function removeAccount(
        address account
    ) external onlyAdmin onlyOnEditMode returns (bool) {
        bool removed = remove(account);
        emit AccountRemoved(removed, account);
        return removed;
    }

    function getSize() external view returns (uint) {
        return size();
    }

    function getByIndex(uint index) external view returns (address account) {
        return allowlist[index];
    }

    function getAccounts() external view returns (address[] memory){
        return allowlist; // mythx-disable-line SWC-128
    }

    function addAccounts(address[] calldata accounts) external onlyAdmin returns (bool) {
        return addAll(accounts);
    }
}
