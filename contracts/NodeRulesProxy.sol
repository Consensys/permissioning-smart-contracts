pragma solidity 0.5.9;

interface NodeRulesProxy {
    function connectionAllowed(
        bytes32 sourceEnodeHigh,
        bytes32 sourceEnodeLow,
        string calldata sourceEnodeIp,
        uint16 sourceEnodePort,
        bytes32 destinationEnodeHigh,
        bytes32 destinationEnodeLow,
        string calldata destinationEnodeIp,
        uint16 destinationEnodePort
    ) external view returns (bytes32);
}
