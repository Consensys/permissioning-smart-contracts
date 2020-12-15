pragma solidity 0.5.9;

import "./NodeRulesProxy.sol";
import "./Ingress.sol";


contract NodeIngress is Ingress {
    // version of this contract: semver eg 1.2.14 represented like 001002014
    uint private version = 1000000;

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
        string memory enodeId,
        string memory enodeIp,
        uint16 enodePort
    ) public view returns (bool) {
        if(getContractAddress(RULES_CONTRACT) == address(0)) {
            return false;
        }

        return NodeRulesProxy(registry[RULES_CONTRACT]).connectionAllowed(
            enodeId,
            enodeIp,
            enodePort
        );
    }
}
