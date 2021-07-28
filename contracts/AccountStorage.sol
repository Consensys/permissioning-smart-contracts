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

    AccountIngress private ingressContract;

    address[] public allowlist;
    mapping (address => uint256) private indexOf; //1 based indexing. 0 means non-existent

    constructor (AccountIngress _ingressContract) public {
        ingressContract = _ingressContract;
        add(msg.sender);
    }

    modifier onlyLatestVersion() {
        require(msg.sender == latestVersion, "only the latestVersion can modify the list");
        _;
    }

    modifier onlyAdmin() {
        if (address(0) == address(ingressContract)) {
            require(msg.sender == owner, "only owner permitted since ingressContract is explicitly set to zero");
        } else {
            address adminContractAddress = ingressContract.getContractAddress(ingressContract.ADMIN_CONTRACT());

            require(adminContractAddress != address(0), "Ingress contract must have Admin contract registered");
            require(Admin(adminContractAddress).isAuthorized(msg.sender), "Sender not authorized");
        }
        _;
    }

    function upgradeVersion(address _newVersion) public onlyAdmin {
        emit VersionChange(latestVersion, _newVersion);
        latestVersion = _newVersion;
    }

    function size() public view returns (uint256) {
        return allowlist.length;
    }

    function exists(address _account) public view returns (bool) {
        return indexOf[_account] != 0;
    }

    function add(address _account) public onlyLatestVersion returns (bool) {
        if (indexOf[_account] == 0) {
            indexOf[_account] = allowlist.push(_account);
            return true;
        }
        return false;
    }

    function remove(address _account) public onlyLatestVersion returns (bool) {
        uint256 index = indexOf[_account];
        if (index > 0 && index <= allowlist.length) { //1-based indexing
            //move last address into index being vacated (unless we are dealing with last index)
            if (index != allowlist.length) {
                address lastAccount = allowlist[allowlist.length - 1];
                allowlist[index - 1] = lastAccount;
                indexOf[lastAccount] = index;
            }

            //shrink array
            allowlist.length -= 1; // mythx-disable-line SWC-101
            indexOf[_account] = 0;
            return true;
        }
        return false;
    }

    function getByIndex(uint index) public view returns (address account) {
        return allowlist[index];
    }

    function getAccounts() public view returns (address[] memory){
        return allowlist;
    }
}