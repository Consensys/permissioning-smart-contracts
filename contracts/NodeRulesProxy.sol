pragma solidity 0.5.9;

interface NodeRulesProxy {
    function connectionAllowed(
        string calldata sourceEnodeId,
        string calldata sourceEnodeHost,
        uint16 sourceEnodePort,
        string calldata destinationEnodeId,
        string calldata destinationEnodeHost,
        uint16 destinationEnodePort
    ) external view returns (bool);
}
