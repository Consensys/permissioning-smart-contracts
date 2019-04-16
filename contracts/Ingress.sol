pragma solidity >=0.4.22 <0.6.0;

import "./AdminProxy.sol";
import "./RulesProxy.sol";


contract Ingress {
    // version of this contract: semver eg 1.2.14 represented like 001002014
    uint version = 1000000;

    // Contract keys
    bytes32 RULES_CONTRACT = 0x72756c6573000000000000000000000000000000000000000000000000000000; // "rules"
    bytes32 ADMIN_CONTRACT = 0x61646d696e697374726174696f6e000000000000000000000000000000000000; // "administration"

    // Registry mapping indexing
    bytes32[] contractKeys;

    struct ContractDetails {
        address owner;
        address contractAddress;
    }

    mapping(bytes32 => ContractDetails) registry;

    event RegistryUpdated(
        address contractAddress,
        bytes32 contractName
    );

    event NodePermissionsUpdated(
        bool addsRestrictions
    );

    function setContractAddress(bytes32 name, address addr) public returns (bool) {
        require(name > 0x0000000000000000000000000000000000000000000000000000000000000000, "Contract name must not be empty.");
        require(isAuthorized(msg.sender), "Not authorized to update contract registry.");

        ContractDetails memory info = registry[name];
        // create info if it doesn't exist in the registry
        if (info.contractAddress == address(0)) {
            info = ContractDetails({
                owner: msg.sender,
                contractAddress: addr
            });
       } else {
            info.contractAddress = addr;
       }
        // update record in the registry
        registry[name] = info;

        // Update registry indexing
        contractKeys.push(name);

        emit RegistryUpdated(addr,name);

        return true;
    }

    function getContractVersion() public view returns(uint) {
        return version;
    }

    function getContractAddress(bytes32 name) public view returns(address) {
        require(name > 0x0000000000000000000000000000000000000000000000000000000000000000, "Contract name must not be empty.");
        return (registry[name].contractAddress);
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

    function isAuthorized(address account) public view returns(bool) {
        if(getContractAddress(ADMIN_CONTRACT) == address(0)) {
            return true;
        } else {
            return AdminProxy(registry[ADMIN_CONTRACT].contractAddress).isAuthorized(account);
        }
    }

    function emitRulesChangeEvent(bool addsRestrictions) public {
        require(registry[RULES_CONTRACT].contractAddress == msg.sender, "Only Rules contract can trigger Rules change events");
        emit NodePermissionsUpdated(addsRestrictions);
    }

    function connectionAllowed(
        bytes32 sourceEnodeHigh,
        bytes32 sourceEnodeLow,
        bytes16 sourceEnodeIp,
        uint16 sourceEnodePort,
        bytes32 destinationEnodeHigh,
        bytes32 destinationEnodeLow,
        bytes16 destinationEnodeIp,
        uint16 destinationEnodePort
    ) public view returns (bytes32) {
        if(getContractAddress(RULES_CONTRACT) == address(0)) {
            return 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
        }

        return RulesProxy(registry[RULES_CONTRACT].contractAddress).connectionAllowed(
            sourceEnodeHigh,
            sourceEnodeLow,
            sourceEnodeIp,
            sourceEnodePort,
            destinationEnodeHigh,
            destinationEnodeLow,
            destinationEnodeIp,
            destinationEnodePort
        );
    }

    function getAllContractKeys() public view returns(bytes32[] memory) {
        return contractKeys;
    }
}