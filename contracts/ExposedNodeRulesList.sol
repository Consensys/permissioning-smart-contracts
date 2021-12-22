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

import "./NodeRulesList.sol";
import "./NodeStorage.sol";


contract ExposedNodeRulesList is NodeRulesList {

    function _setStorage(NodeStorage _storage) public {
        return setStorage(_storage);
    }

    function _calculateKey(string calldata _enodeId, string calldata _host, uint16 _port) external view returns(uint256) {
        return calculateKey(_enodeId, _host, _port);
    }

    function _size() external view returns (uint256) {
        return size();
    }

    function _exists(string calldata _enodeId, string calldata _host, uint16 _port) external view returns (bool) {
        return exists(_enodeId, _host, _port);
    }

    function _add(string calldata _enodeId, string calldata _host, uint16 _port) external returns (bool) {
        return add(_enodeId, _host, _port);
    }

    function _remove(string calldata _enodeId, string calldata _host, uint16 _port) external returns (bool) {
        return remove(_enodeId, _host, _port);
    }
}
