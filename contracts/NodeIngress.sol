/*
 * Copyright ConsenSys AG.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity >=0.6.0 <0.9.0;

import "./NodeRulesProxy.sol";
import "./Ingress.sol";


contract NodeIngress is Ingress {
    // version of this contract: semver eg 1.2.14 represented like 001002014
    uint private version = 1000000;

    event NodePermissionsUpdated(
        bool addsRestrictions
    );

    function getContractVersion() external view returns(uint) {
        return version;
    }

    function emitRulesChangeEvent(bool addsRestrictions) external {
        require(registry[RULES_CONTRACT] == msg.sender, "Only Rules contract can trigger Rules change events");
        emit NodePermissionsUpdated(addsRestrictions);
    }

    function connectionAllowed(
        string calldata enodeId,
        string calldata enodeHost,
        uint16 enodePort
    ) external view returns (bool) {
        if(getContractAddress(RULES_CONTRACT) == address(0)) {
            return false;
        }

        return NodeRulesProxy(registry[RULES_CONTRACT]).connectionAllowed(
            enodeId,
            enodeHost,
            enodePort
        );
    }
}
