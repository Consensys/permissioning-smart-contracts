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
}
