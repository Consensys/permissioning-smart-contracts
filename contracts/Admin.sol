pragma solidity 0.5.9;

import "./AdminProxy.sol";
import "./AdminList.sol";


contract Admin is AdminProxy, AdminList {
    modifier onlyAdmin() {
        require(isAuthorized(msg.sender), "Sender not authorized");
        _;
    }

    modifier notSelf(address _address) {
        require(msg.sender != _address, "Cannot invoke method with own account as parameter");
        _;
    }

    constructor() public {
        add(msg.sender);
    }

    function isAuthorized(address _address) public view returns (bool) {
        return exists(_address);
    }

    function addAdmin(address _address) external onlyAdmin returns (bool) {
        if (msg.sender == _address) {
            emit AdminAdded(false, _address, "Adding own account as Admin is not permitted");
            return false;
        } else {
            bool result = add(_address);
            string memory message = result ? "Admin account added successfully" : "Account is already an Admin";
            emit AdminAdded(result, _address, message);
            return result;
        }
    }

    function removeAdmin(address _address) external onlyAdmin notSelf(_address) returns (bool) {
        bool removed = remove(_address);
        emit AdminRemoved(removed, _address);
        return removed;
    }

    function getAdmins() external view returns (address[] memory){
        return allowlist; // mythx-disable-line SWC-128
    }

    function addAdmins(address[] calldata accounts) external onlyAdmin returns (bool) {
        return addAll(accounts);
    }
}
