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

import "./Admin.sol";
import "./NodeIngress.sol";


contract NodeStorage {
    event VersionChange(
        address oldAddress,
        address newAddress
    );
    // initialize this to the deployer of this contract
    address private latestVersion = msg.sender;
    address private owner = msg.sender;

    NodeIngress private ingressContract;



    // struct size = 82 bytes
    struct enode {
        string enodeId;
        string ip;
        uint16 port;
    }

    enode[] public allowlist;
    mapping (uint256 => uint256) private indexOf; //1-based indexing. 0 means non-existent

    bool private onlyUseEnodeId;

    constructor (NodeIngress _ingressContract) public {
        ingressContract = _ingressContract;
        onlyUseEnodeId = false;
    }

    modifier onlyLatestVersion() {
        require(msg.sender == latestVersion, "only the latestVersion can modify the list");
        _;
    }

    modifier onlyAdmin() {
        if (address(0) == address(ingressContract)) {
            require(msg.sender == owner, "only owner permitted since ingressContract is explicitly set to zero");
        } else {
            address adminContractAddress = ingressContract.getContractAddress(ingressContract.ADMIN_CONTRACT());

            require(adminContractAddress != address(0), "Ingress contract must have Admin contract registered");
            require(Admin(adminContractAddress).isAuthorized(msg.sender), "Sender not authorized");
        }
        _;
    }

    function upgradeVersion(address _newVersion) public onlyAdmin {
        emit VersionChange(latestVersion, _newVersion);
        latestVersion = _newVersion;
    }

    function size() public view returns (uint256) {
        return allowlist.length;
    }

    function exists(string memory _enodeId, string memory _host, uint16 _port) public view returns (bool) {
        return indexOf[calculateKey(_enodeId, _host, _port)] != 0;
    }

    function add(string memory _enodeId, string memory _host, uint16 _port) public onlyLatestVersion returns (bool) {
        uint256 key = calculateKey(_enodeId, _host, _port);
        if (indexOf[key] == 0) {
            allowlist.push(enode(_enodeId, _host, _port));
            indexOf[key] = allowlist.length;
            return true;
        }
        return false;
    }

    function remove(string memory _enodeId, string memory _host, uint16 _port) public onlyLatestVersion returns (bool) {
        uint256 key = calculateKey(_enodeId, _host, _port);
        uint256 index = indexOf[key];

        if (index > 0 && index <= allowlist.length) { //1 based indexing
            //move last item into index being vacated (unless we are dealing with last index)
            if (index != allowlist.length) {
                enode memory lastEnode = allowlist[allowlist.length - 1];
                allowlist[index - 1] = lastEnode;
                indexOf[calculateKey(lastEnode.enodeId, lastEnode.ip, lastEnode.port)] = index;
            }

            //shrink array
            allowlist.pop();
            indexOf[key] = 0;
            return true;
        }

        return false;
    }

    function getByIndex(uint index) external view returns (string memory enodeId, string memory ip, uint16 port) {
        if (index >= 0 && index < size()) {
            enode memory item = allowlist[index];
            return (item.enodeId, item.ip, item.port);
        }
    }

    function setValidateEnodeIdOnly (bool _onlyUseEnodeId) public onlyLatestVersion returns (bool) {
        if (onlyUseEnodeId == _onlyUseEnodeId) {
            return true;
        }

        // First we reset old map entries
        enode memory entry;
        for (uint256 index = 0; index < allowlist.length; index++) {
            entry = allowlist[index];
            indexOf[calculateKey(entry.enodeId, entry.ip, entry.port)] = 0;
        }

        onlyUseEnodeId = _onlyUseEnodeId;

        for (uint256 index = 0; index < allowlist.length; index++) {
            entry = allowlist[index];
            indexOf[calculateKey(entry.enodeId, entry.ip, entry.port)] = index + 1;
        }

        return true;
    }

    function calculateKey(string memory _enodeId, string memory _host, uint16 _port) public view returns(uint256) {
        if (!onlyUseEnodeId) {
            return uint256(keccak256(abi.encodePacked(_enodeId, _host, _port)));
        }
        return uint256(keccak256(abi.encodePacked(_enodeId)));
    }
}
