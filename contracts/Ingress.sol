pragma solidity 0.5.9;

import "./AdminProxy.sol";


contract Ingress {
    // Contract keys
    bytes32 public RULES_CONTRACT = 0x72756c6573000000000000000000000000000000000000000000000000000000; // "rules"
    bytes32 public ADMIN_CONTRACT = 0x61646d696e697374726174696f6e000000000000000000000000000000000000; // "administration"

    // Registry mapping indexing
    address[] internal registry;
    bytes32[] internal contractKeys;
    mapping (bytes32 => uint256) internal indexOf; //1 based indexing. 0 means non-existent

    event RegistryUpdated(
        address contractAddress,
        bytes32 contractName
    );

    function getContractAddress(bytes32 name) public view returns(address) {
        require(name > 0, "Contract name must not be empty.");
        uint256 i = indexOf[name];
        if (i > 0 && i <= registry.length) {
            return (registry[i-1]);
        } else {
            return address(0);
        }
    }

    function getSize() public view returns (uint256) {
        return registry.length;
    }

    function isAuthorized(address account) public view returns(bool) {
        if(getContractAddress(ADMIN_CONTRACT) == address(0)) {
            return true;
        } else {
            return AdminProxy(registry[indexOf[ADMIN_CONTRACT]-1]).isAuthorized(account);
        }
    }

    function setContractAddress(bytes32 name, address addr) public returns (bool) {
        require(name > 0, "Contract name must not be empty.");
        require(addr != address(0), "Contract address must not be zero.");
        require(isAuthorized(msg.sender), "Not authorized to update contract registry.");

        address info = address(0);
        uint256 i = indexOf[name];
        if (i > 0 && i <= registry.length) {
            info = registry[i-1];
        }
        // create info if it doesn't exist in the registry
        if (info == address(0)) {
            // Update registry indexing
            indexOf[name] = registry.push(addr);
            contractKeys.push(name);
        } else {
            // update record in the registry
            registry[indexOf[name]-1] = addr;
        }

        emit RegistryUpdated(addr,name);

        return true;
    }

    function removeContract(bytes32 _name) public returns(bool) {
        require(_name > 0, "Contract name must not be empty.");
        require(registry.length > 0, "Must have at least one registered contract to execute delete operation.");
        require(isAuthorized(msg.sender), "Not authorized to update contract registry.");

        uint256 index = indexOf[_name];
        if (index > 0 && index <= registry.length) { //1-based indexing
            //move last address into index being vacated (unless we are dealing with last index)
            if (index != registry.length) {
                address lastAccount = registry[registry.length - 1];
                bytes32 lastKey = contractKeys[registry.length - 1];
                registry[index - 1] = lastAccount;
                contractKeys[index - 1] = lastKey;
                indexOf[lastKey] = index;
            }

            //shrink registry and keys arrays
            registry.length -= 1;
            contractKeys.length -= 1;
            indexOf[_name] = 0;
            emit RegistryUpdated(address(0), _name);
            return true;
        }
        return false;
    }

    function getAllContractKeys() public view returns(bytes32[] memory) {
        return contractKeys;
    }
}
