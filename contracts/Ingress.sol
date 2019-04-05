pragma solidity >=0.4.22 <0.6.0;
// THIS CONTRACT IS FOR TESTING PURPOSES ONLY
// DO NOT USE THIS CONTRACT IN PRODUCTION APPLICATIONS

import './RulesProxy.sol';

contract Ingress {

   // Contract keys
   string RULES_CONTRACT = "rules";

   struct ContractDetails {
      address owner;
      address contractAddress;
      uint16 version;
   }
   mapping(string => ContractDetails) registry;
   function registerName(string memory name, address addr, uint16 ver) public returns (bool) {
      // versions should start from 1
      require(ver >= 1);
      
      ContractDetails memory info = registry[name];
      require(info.owner == address(0) || info.owner == msg.sender);
      // create info if it doesn't exist in the registry
       if (info.contractAddress == address(0)) {
          info = ContractDetails({
             owner: msg.sender,
             contractAddress: addr,
             version: ver
          });
       } else {
          info.version = ver;
          info.contractAddress = addr;
       }
       // update record in the registry
       registry[name] = info;
       return true;
   }
    function getContractDetails(string memory name) public view returns(address, uint16) {
      return (registry[name].contractAddress, registry[name].version);
   }

   function connectionAllowed(bytes32 sourceEnodeHigh, bytes32 sourceEnodeLow, bytes16 sourceEnodeIp, uint16 sourceEnodePort, 
        bytes32 destinationEnodeHigh, bytes32 destinationEnodeLow, bytes16 destinationEnodeIp, uint16 destinationEnodePort) public view returns (bool) {
      return RulesProxy(registry[RULES_CONTRACT].contractAddress).connectionAllowed(sourceEnodeHigh, sourceEnodeLow, sourceEnodeIp, sourceEnodePort, 
      destinationEnodeHigh, destinationEnodeLow, destinationEnodeIp, destinationEnodePort);
   }
}