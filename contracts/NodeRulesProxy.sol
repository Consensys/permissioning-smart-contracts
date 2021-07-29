pragma solidity 0.5.9;

interface NodeRulesProxy {
    function connectionAllowed(
        string calldata enodeId,
        string calldata enodeHost,
        uint16 enodePort
    ) external view returns (bool);
}
