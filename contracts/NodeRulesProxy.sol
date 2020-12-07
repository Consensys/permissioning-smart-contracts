pragma solidity 0.5.9;

interface NodeRulesProxy {
    function connectionAllowed(
        string calldata sourceEnodeHigh,
        bytes32 sourceEnodeLow,
        string calldata sourceEnodeIp,
        uint16 sourceEnodePort,
        string calldata destinationEnodeHigh,
        bytes32 destinationEnodeLow,
        string calldata destinationEnodeIp,
        uint16 destinationEnodePort
    ) external view returns (bytes32);
}
