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

import "./AdminProxy.sol";


contract Ingress {
    // Contract keys
    bytes32 public RULES_CONTRACT = 0x72756c6573000000000000000000000000000000000000000000000000000000; // "rules"
    bytes32 public ADMIN_CONTRACT = 0x61646d696e697374726174696f6e000000000000000000000000000000000000; // "administration"

    // Registry mapping indexing
    mapping(bytes32 => address) internal registry;

    bytes32[] internal contractKeys;
    mapping (bytes32 => uint256) internal indexOf; //1 based indexing. 0 means non-existent

    event RegistryUpdated(
        address contractAddress,
        bytes32 contractName
    );

    function getContractAddress(bytes32 name) public view returns(address) {
        require(name > 0, "Contract name must not be empty.");
        return registry[name];
    }

    function getSize() external view returns (uint256) {
        return contractKeys.length;
    }

    function isAuthorized(address account) public view returns(bool) {
        if (registry[ADMIN_CONTRACT] == address(0)) {
            return true;
        } else {
            return AdminProxy(registry[ADMIN_CONTRACT]).isAuthorized(account);
        }
    }

    function setContractAddress(bytes32 name, address addr) external returns (bool) {
        require(name > 0, "Contract name must not be empty.");
        require(addr != address(0), "Contract address must not be zero.");
        require(isAuthorized(msg.sender), "Not authorized to update contract registry.");

        if (indexOf[name] == 0) {
            contractKeys.push(name);
            indexOf[name] = contractKeys.length;
        }

        registry[name] = addr;

        emit RegistryUpdated(addr, name);

        return true;
    }

    function removeContract(bytes32 _name) external returns(bool) {
        require(_name > 0, "Contract name must not be empty.");
        require(contractKeys.length > 0, "Must have at least one registered contract to execute delete operation.");
        require(isAuthorized(msg.sender), "Not authorized to update contract registry.");

        uint256 index = indexOf[_name];
        if (index > 0 && index <= contractKeys.length) { //1-based indexing
            //move last address into index being vacated (unless we are dealing with last index)
            if (index != contractKeys.length) {
                bytes32 lastKey = contractKeys[contractKeys.length - 1];
                contractKeys[index - 1] = lastKey;
                indexOf[lastKey] = index;
            }

            //shrink contract keys array
            contractKeys.pop();
            indexOf[_name] = 0;
            registry[_name] = address(0);
            emit RegistryUpdated(address(0), _name);
            return true;
        }
        return false;
    }

    function getAllContractKeys() external view returns(bytes32[] memory) {
        return contractKeys; // mythx-disable-line SWC-128
    }
}
