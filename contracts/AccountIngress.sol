pragma solidity 0.5.9;

import "./AccountRulesProxy.sol";
import "./Ingress.sol";


contract AccountIngress is Ingress {
    // version of this contract: semver eg 1.2.14 represented like 001002014
    uint private version = 1000000;

    function getContractVersion() external view returns(uint) {
        return version;
    }

    function transactionAllowed(
        address sender,
        address target,
        uint256 value,
        uint256 gasPrice,
        uint256 gasLimit,
        bytes calldata payload
    ) external view returns (bool) {
        if(getContractAddress(RULES_CONTRACT) == address(0)) {
            return true;
        }

        return AccountRulesProxy(registry[RULES_CONTRACT]).transactionAllowed(
            sender, target, value, gasPrice, gasLimit, payload
        );
    }
}
