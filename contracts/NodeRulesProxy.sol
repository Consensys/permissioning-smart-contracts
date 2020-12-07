pragma solidity 0.5.9;

interface NodeRulesProxy {
    function connectionAllowed(
        string calldata sourceEnodeHigh,
        string calldata sourceEnodeIp,
        uint16 sourceEnodePort,
        string calldata destinationEnodeHigh,
        string calldata destinationEnodeIp,
        uint16 destinationEnodePort
    ) external view returns (bytes32);
}
