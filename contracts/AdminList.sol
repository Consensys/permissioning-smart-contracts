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


contract AdminList {
    event AdminAdded(
        bool adminAdded,
        address account,
        string message
    );

    event AdminRemoved(
        bool adminRemoved,
        address account
    );

    address[] public allowlist;
    mapping (address => uint256) private indexOf; //1 based indexing. 0 means non-existent

    function size() internal view returns (uint256) {
        return allowlist.length;
    }

    function exists(address _account) internal view returns (bool) {
        return indexOf[_account] != 0;
    }

    function add(address _account) internal returns (bool) {
        if (indexOf[_account] == 0) {
            allowlist.push(_account);
            indexOf[_account] = allowlist.length;
            return true;
        }
        return false;
    }

    function addAll(address[] memory accounts) internal returns (bool) {
        bool allAdded = true;
        for (uint i = 0; i<accounts.length; i++) {
            if (msg.sender == accounts[i]) {
                emit AdminAdded(false, accounts[i], "Adding own account as Admin is not permitted");
                allAdded = allAdded && false;
            } else if (exists(accounts[i])) {
                emit AdminAdded(false, accounts[i], "Account is already an Admin");
                allAdded = allAdded && false;
            }  else {
                bool result = add(accounts[i]);
                string memory message = result ? "Admin account added successfully" : "Account is already an Admin";
                emit AdminAdded(result, accounts[i], message);
                allAdded = allAdded && result;
            }
        }

        return allAdded;
    }

    function remove(address _account) internal returns (bool) {
        uint256 index = indexOf[_account];
        if (index > 0 && index <= allowlist.length) { //1-based indexing
            //move last address into index being vacated (unless we are dealing with last index)
            if (index != allowlist.length) {
                address lastAccount = allowlist[allowlist.length - 1];
                allowlist[index - 1] = lastAccount;
                indexOf[lastAccount] = index;
            }

            //shrink array
            allowlist.pop();
            indexOf[_account] = 0;
            return true;
        }
        return false;
    }
}
