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

import "./NodeStorage.sol";


contract NodeRulesList {

    // struct size = 82 bytes
    struct enode {
        string enodeId;
        string host;
        uint16 port;
    }

    NodeStorage private nodeStorage;

    function setStorage(NodeStorage _storage) internal {
        nodeStorage = _storage;
    }

    function upgradeVersion(address _newVersion) internal {
        nodeStorage.upgradeVersion(_newVersion);
    }

    function size() internal view returns (uint256) {
        return nodeStorage.size();
    }

    function exists(string memory _enodeId, string memory _host, uint16 _port) internal view returns (bool) {
        return nodeStorage.exists(_enodeId, _host, _port);
    }

    function add(string memory _enodeId, string memory _host, uint16 _port) internal returns (bool) {
        return nodeStorage.add(_enodeId, _host, _port);
    }

    function remove(string memory _enodeId, string memory _host, uint16 _port) internal returns (bool) {
        return nodeStorage.remove(_enodeId, _host, _port);
    }

    function calculateKey(string memory _enodeId, string memory _host, uint16 _port) public view returns(uint256) {
        return nodeStorage.calculateKey(_enodeId, _host, _port);
    }

    function getByIndex(uint index) external view returns (string memory enodeId, string memory host, uint16 port) {
        return nodeStorage.getByIndex(index);
    }

    function setValidateEnodeIdOnly(bool _onlyUseEnodeId) internal returns (bool) {
        return nodeStorage.setValidateEnodeIdOnly(_onlyUseEnodeId);
    }
}
