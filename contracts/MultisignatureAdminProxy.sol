pragma solidity 0.5.9;

import "./Admin.sol";
import "./AccountIngress.sol";
import "./Ingress.sol";

contract MultisignatureAdminProxy {

    address[] accountAllowList;
    mapping (address => uint256) accountIndexOf;
    Ingress ingressContract;

    modifier ownerExists(address sender) {
        require(Admin(getAdminContract()).isAuthorized(sender), "Sender not authorized");
        _;
    }

    function getOwnersSize() internal view returns(uint256){
        return Admin(getAdminContract()).size();
    }

    function getOwner(uint256 index) internal view returns(address){
        return Admin(getAdminContract()).getAdmin(index);
    }

    function getRequiredCount()internal view returns (uint256){
        return Admin(getAdminContract()).getRequired();
    }

    function getAdminContract() private view returns(address){
        address adminContractAddress = ingressContract.getContractAddress(ingressContract.ADMIN_CONTRACT());
        require(adminContractAddress != address(0), "Ingress contract must have Admin contract registered");
        return adminContractAddress;
    }

    function addPermittedAccount(address _account) public returns (bool) {
        if (accountIndexOf[_account] == 0) {
            accountIndexOf[_account] = accountAllowList.push(_account);
            return true;
        }
        return false;
    }

    function removePermittedAccount(address _account) public returns (bool) {
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

    function existsAccount(address _account) internal view returns (bool) {
        return accountIndexOf[_account] != 0;
    }
}
