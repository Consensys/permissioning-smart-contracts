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

import "./AccountRulesList.sol";
import "./AccountStorage.sol";


contract ExposedAccountRulesList is AccountRulesList {

    function _setStorage(AccountStorage _storage) public {
        return setStorage(_storage);
    }

    function _size() external view returns (uint256) {
        return size();
    }

    function _exists(address _account) external view returns (bool) {
        return exists(_account);
    }

    function _add(address _account) external returns (bool) {
        return add(_account);
    }

    function _addAll(address[] calldata accounts) external returns (bool) {
        return addAll(accounts);
    }

    function _remove(address _account) external returns (bool) {
        return remove(_account);
    }
}
