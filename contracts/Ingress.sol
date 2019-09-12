pragma solidity 0.5.9;

import "./AdminProxy.sol";


contract Ingress {
    // Contract keys
    bytes32 public RULES_CONTRACT = 0x72756c6573000000000000000000000000000000000000000000000000000000; // "rules"
    bytes32 public ADMIN_CONTRACT = 0x61646d696e697374726174696f6e000000000000000000000000000000000000; // "administration"

    // Registry mapping indexing
    bytes32[] contractKeys;

    struct ContractDetails {
        address contractAddress;
        address owner;
    }

    mapping(bytes32 => ContractDetails) registry;

    event RegistryUpdated(
        address contractAddress,
        bytes32 contractName
    );

    function getContractAddress(bytes32 name) public view returns(address) {
        require(name > 0x0000000000000000000000000000000000000000000000000000000000000000, "Contract name must not be empty.");
        return (registry[name].contractAddress);
    }

    function isAuthorized(address account) public view returns(bool) {
        if(getContractAddress(ADMIN_CONTRACT) == address(0)) {
            return true;
        } else {
            return AdminProxy(registry[ADMIN_CONTRACT].contractAddress).isAuthorized(account);
        }
    }

    function setContractAddress(bytes32 name, address addr) public returns (bool) {
        require(name > 0x0000000000000000000000000000000000000000000000000000000000000000, "Contract name must not be empty.");
        require(addr != address(0), "Contract address must not be zero.");
        require(isAuthorized(msg.sender), "Not authorized to update contract registry.");

        ContractDetails memory info = registry[name];
        // create info if it doesn't exist in the registry
        if (info.contractAddress == address(0)) {
            info = ContractDetails({
                owner: msg.sender,
                contractAddress: addr
            });

            // Update registry indexing
            contractKeys.push(name);
       } else {
            info.contractAddress = addr;
       }
        // update record in the registry
        registry[name] = info;

        emit RegistryUpdated(addr,name);

        return true;
    }

    function removeContract(bytes32 name) public returns(bool) {
        require(name > 0x0000000000000000000000000000000000000000000000000000000000000000, "Contract name must not be empty.");
        require(contractKeys.length > 0, "Must have at least one registered contract to execute delete operation.");
        require(isAuthorized(msg.sender), "Not authorized to update contract registry.");
        for (uint i = 0; i < contractKeys.length; i++) {
            // Delete the key from the array + mapping if it is present
            if (contractKeys[i] == name) {
                delete registry[contractKeys[i]];
                contractKeys[i] = contractKeys[contractKeys.length - 1];
                delete contractKeys[contractKeys.length - 1];
                contractKeys.length--;

                emit RegistryUpdated(address(0),name);
                return true;
            }
        }
        return false;
    }

    function getAllContractKeys() public view returns(bytes32[] memory) {
        return contractKeys;
    }
}
