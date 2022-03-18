pragma solidity 0.5.9;

import "./Admin.sol";
import "./AccountIngress.sol";


contract AccountStorage {
    event VersionChange(
        address oldAddress,
        address newAddress
    );
    // initialize this to the deployer of this contract
    address private latestVersion = msg.sender;
    address private owner = msg.sender;
    address private accountRules = msg.sender;

    AccountIngress internal ingressContract;

    address[] public accountAllowList;
    address[] public targetAllowList;
    mapping (address => uint256) private accountIndexOf; //1 based indexing. 0 means non-existent
    mapping (address => uint256) private targetIndexOf; //1 based indexing. 0 means non-existent

    modifier onlyLatestVersion() {
        require(msg.sender == latestVersion, "only the latestVersion can modify the list");
        _;
    }

    modifier onlyAccountRules() {
        require(msg.sender == accountRules, "only the AccountRules contract can call");
        _;
    }

    modifier ownerExists(address sender) {
        if (address(0) == address(ingressContract)) {
            require(sender == owner, "only owner permitted since ingressContract is explicitly set to zero");
        } else {
            address adminContractAddress = ingressContract.getContractAddress(ingressContract.ADMIN_CONTRACT());

            require(adminContractAddress != address(0), "Ingress contract must have Admin contract registered");
            require(Admin(adminContractAddress).isAuthorized(sender), "Sender not authorized");
        }
        _;
    }

    function upgradeVersion(address _newVersion) public ownerExists(msg.sender) {
        emit VersionChange(latestVersion, _newVersion);
        latestVersion = _newVersion;
    }

    function updateAccountRules(address _accountRules) public onlyAccountRules {
        emit VersionChange(accountRules, _accountRules);
        accountRules = _accountRules;
    }

    function sizeAccounts() public view onlyAccountRules returns (uint256) {
        return accountAllowList.length;
    }

    function sizeTargets() public view onlyAccountRules returns (uint256) {
        return targetAllowList.length;
    }

    function existsAccount(address _account) public view onlyAccountRules returns (bool) {
        return accountIndexOf[_account] != 0;
    }

    function existsTarget(address _target) public view onlyAccountRules returns (bool) {
        return targetIndexOf[_target] != 0;
    }

    function addAccount(address _account) public onlyAccountRules returns (bool) {
        if (accountIndexOf[_account] == 0) {
            accountIndexOf[_account] = accountAllowList.push(_account);
            return true;
        }
        return false;
    }

    function removeAccount(address _account) public onlyAccountRules returns (bool) {
        uint256 index = accountIndexOf[_account];
        if (index > 0 && index <= accountAllowList.length) { //1-based indexing
            //move last address into index being vacated (unless we are dealing with last index)
            if (index != accountAllowList.length) {
                address lastAccount = accountAllowList[accountAllowList.length - 1];
                accountAllowList[index - 1] = lastAccount;
                accountIndexOf[lastAccount] = index;
            }

            //shrink array
            accountAllowList.length -= 1; // mythx-disable-line SWC-101
            accountIndexOf[_account] = 0;
            return true;
        }
        return false;
    }

    function addTarget(address _target) public onlyAccountRules returns (bool) {
        if (targetIndexOf[_target] == 0) {
            targetIndexOf[_target] = targetAllowList.push(_target);
            return true;
        }
        return false;
    }

    function removeTarget(address _target) public onlyAccountRules returns (bool) {
        uint256 index = targetIndexOf[_target];
        if (index > 0 && index <= targetAllowList.length) { //1-based indexing
            //move last address into index being vacated (unless we are dealing with last index)
            if (index != targetAllowList.length) {
                address lastAccount = targetAllowList[targetAllowList.length - 1];
                targetAllowList[index - 1] = lastAccount;
                targetIndexOf[lastAccount] = index;
            }

            //shrink array
            targetAllowList.length -= 1;
            targetIndexOf[_target] = 0;
            return true;
        }
        return false;
    }

    function getByIndex(uint index) public view returns (address account) {
        return accountAllowList[index];
    }
    function getTargetByIndex(uint index) public view returns (address account) {
        return targetAllowList[index];
    }

    function getAccounts() public view onlyAccountRules returns (address[] memory){
        return accountAllowList;
    }

    function getTargets() public view onlyAccountRules returns (address[] memory){
        return targetAllowList;
    }
}
