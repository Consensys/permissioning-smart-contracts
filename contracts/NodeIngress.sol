pragma solidity 0.5.9;

import "./NodeRulesProxy.sol";
import "./Ingress.sol";


contract NodeIngress is Ingress {
    // version of this contract: semver eg 1.2.14 represented like 001002014
    uint version = 1000000;

    event NodePermissionsUpdated(
        bool addsRestrictions
    );

    function getContractVersion() public view returns(uint) {
        return version;
    }

    function emitRulesChangeEvent(bool addsRestrictions) public {
        require(registry[RULES_CONTRACT] == msg.sender, "Only Rules contract can trigger Rules change events");
        emit NodePermissionsUpdated(addsRestrictions);
    }

    function connectionAllowed(
        bytes32 sourceEnodeHigh,
        bytes32 sourceEnodeLow,
        bytes16 sourceEnodeIp,
        uint16 sourceEnodePort,
        bytes32 destinationEnodeHigh,
        bytes32 destinationEnodeLow,
        bytes16 destinationEnodeIp,
        uint16 destinationEnodePort
    ) public view returns (bytes32) {
        if(getContractAddress(RULES_CONTRACT) == address(0)) {
            return 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
        }

        return NodeRulesProxy(registry[RULES_CONTRACT]).connectionAllowed(
            sourceEnodeHigh,
            sourceEnodeLow,
            sourceEnodeIp,
            sourceEnodePort,
            destinationEnodeHigh,
            destinationEnodeLow,
            destinationEnodeIp,
            destinationEnodePort
        );
    }
}
