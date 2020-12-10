pragma solidity 0.5.9;

interface NodeRulesProxy {
    function connectionAllowed(
        string calldata sourceEnodeId,
        string calldata sourceEnodeIp,
        uint16 sourceEnodePort
    ) external view returns (bytes32);
}
