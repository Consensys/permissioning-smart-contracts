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

import "./AccountRulesProxy.sol";
import "./AccountRulesList.sol";
import "./AccountIngress.sol";
import "./Admin.sol";
import "./AccountStorage.sol";


contract AccountRules is AccountRulesProxy, AccountRulesList {

    // in read-only mode rules can't be added/removed
    // this will be used to protect data when upgrading contracts
    bool private readOnlyMode = false;
    // version of this contract: semver like 1.2.14 represented like 001002014
    uint private version = 3000000;

    AccountIngress private ingressContract;

    modifier onlyOnEditMode() {
        require(!readOnlyMode, "In read only mode: rules cannot be modified");
        _;
    }

    modifier onlyAdmin() {
        require(isAuthorizedAdmin(msg.sender), "Sender not authorized");
        _;
    }

    constructor (AccountIngress _ingressContract, AccountStorage _storage) public {
        setStorage(_storage);
        ingressContract = _ingressContract;
    }

    // VERSION
    function getContractVersion() external view returns (uint) {
        return version;
    }

    // READ ONLY MODE
    function isReadOnly() external view returns (bool) {
        return readOnlyMode;
    }

    function enterReadOnly() external onlyAdmin returns (bool) {
        require(readOnlyMode == false, "Already in read only mode");
        readOnlyMode = true;
        return true;
    }

    function exitReadOnly() external onlyAdmin returns (bool) {
        require(readOnlyMode == true, "Not in read only mode");
        readOnlyMode = false;
        return true;
    }

    function transactionAllowed(
        address sender,
        address, // target
        uint256, // value
        uint256, // gasPrice
        uint256, // gasLimit
        bytes calldata // payload
    ) external override view returns (bool) {
        if (accountPermitted(sender)) {
            return true;
        }
        if (isAuthorizedAdmin(sender)) {
            return true;
        }
        return false;
    }

    function accountPermitted(
        address _account
    ) public view returns (bool) {
        return exists(_account);
    }

    function addAccount(
        address account
    ) external onlyAdmin onlyOnEditMode returns (bool) {
        bool added = add(account);
        emit AccountAdded(added, account);
        return added;
    }

    function removeAccount(
        address account
    ) external onlyAdmin onlyOnEditMode returns (bool) {
        bool removed = remove(account);
        emit AccountRemoved(removed, account);
        return removed;
    }

    function getSize() external view returns (uint) {
        return size();
    }

    function addAccounts(address[] calldata accounts) external onlyAdmin returns (bool) {
        return addAll(accounts);
    }

    function isAuthorizedAdmin(address user) private view returns (bool) {
        address adminContractAddress = ingressContract.getContractAddress(ingressContract.ADMIN_CONTRACT());

        require(adminContractAddress != address(0), "Ingress contract must have Admin contract registered");
        return Admin(adminContractAddress).isAuthorized(user);
    }
}
