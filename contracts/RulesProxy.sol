pragma solidity >=0.4.22 <0.6.0;

interface RulesProxy {
    function connectionAllowed(bytes32 sourceEnodeHigh, bytes32 sourceEnodeLow, bytes16 sourceEnodeIp, uint16 sourceEnodePort, 
        bytes32 destinationEnodeHigh, bytes32 destinationEnodeLow, bytes16 destinationEnodeIp, uint16 destinationEnodePort) external view returns (bool);
}