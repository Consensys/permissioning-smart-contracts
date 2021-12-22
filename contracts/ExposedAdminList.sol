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

import "./AdminList.sol";


// This class is used as a proxy to allow us to write unit tests.
// All methods in the original class are internal.
contract ExposedAdminList is AdminList {
    function _size() external view returns (uint256) {
        return size();
    }

    function _exists(address _address) external view returns (bool) {
        return exists(_address);
    }

    function _add(address _address) external returns (bool) {
        return add(_address);
    }

    function _remove(address _address) external returns (bool) {
        return remove(_address);
    }

    function _addBatch(address[] calldata _addresses) external returns (bool) {
        return addAll(_addresses);
    }
}
