pragma solidity 0.5.9;

interface NodeRulesProxy {
    function connectionAllowed(
        string calldata sourceEnodeId,
        string calldata sourceEnodeIp,
        uint16 sourceEnodePort,
        string calldata destinationEnodeId,
        string calldata destinationEnodeIp,
        uint16 destinationEnodePort
    ) external view returns (bytes32);
}
