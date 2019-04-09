pragma solidity >=0.4.22 <0.6.0;
// THIS CONTRACT IS FOR TESTING PURPOSES ONLY
// DO NOT USE THIS CONTRACT IN PRODUCTION APPLICATIONS

import "./RulesProxy.sol";


contract Ingress {
    // version of this contract: semver like 1.2.14 represented like 001002014
    uint version = 1000000;

    // Contract keys
    bytes32 RULES_CONTRACT = 0x72756c6573000000000000000000000000000000000000000000000000000000; // "rules"
    bytes32 ADMIN_CONTRACT = 0x61646d696e697374726174696f6e000000000000000000000000000000000000; // "administration"

    // Registry mapping indexing
    uint contractCount = 0;
    bytes32[] contractKeys;

    struct ContractDetails {
        address owner;
        address contractAddress;
    }

    mapping(bytes32 => ContractDetails) registry;

    function setContractAddress(bytes32 name, address addr) public returns (bool) {
        ContractDetails memory info = registry[name];
        require(info.owner == address(0) || info.owner == msg.sender, "Not authorized to update contract registry.");
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
        contractCount = contractCount + 1;

        return true;
    }

    function getContractVersion() public view returns(uint) {
        return version;
    }

    function getContractAddress(bytes32 name) public view returns(address) {
        return (registry[name].contractAddress);
    }

    function isConnectionAllowed(
        bytes32 sourceEnodeHigh,
        bytes32 sourceEnodeLow,
        bytes16 sourceEnodeIp,
        uint16 sourceEnodePort,
        bytes32 destinationEnodeHigh,
        bytes32 destinationEnodeLow,
        bytes16 destinationEnodeIp,
        uint16 destinationEnodePort
    ) public view returns (bool) {
        return RulesProxy(registry[RULES_CONTRACT].contractAddress).isConnectionAllowed(
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

    function getAllContactKeys() public view returns(bytes32[] memory) {
        return contractKeys;
    }
}