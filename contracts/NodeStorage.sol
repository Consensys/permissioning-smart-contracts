pragma solidity 0.5.9;

import "./Admin.sol";
import "./NodeIngress.sol";
import "./Types.sol";

contract NodeStorage is Types{
    event VersionChange(
        address oldAddress,
        address newAddress
    );
    // initialize this to the deployer of this contract
    address private latestVersion = msg.sender;
    address private owner = msg.sender;
    address private nodeRules = msg.sender;

    NodeIngress internal ingressContract;

    Enode[] public allowlist;
    mapping (uint256 => uint256) private indexOf; //1-based indexing. 0 means non-existent
    mapping (bytes32 => bool) private allowGroups;

    bool internal onlyUseEnodeId;

    modifier onlyLatestVersion() {
        require(msg.sender == latestVersion, "only the latestVersion can modify the list");
        _;
    }

    modifier onlyNodeRules() {
        require(msg.sender == nodeRules, "only the NodeRules contract can call");
        _;
    }

    modifier ownerExists(address sender) {
        if (address(0) == address(ingressContract)) {
            require(sender == owner, "only owner permitted since ingressContract is explicitly set to zero");
        } else {
            address adminContractAddress = ingressContract.getContractAddress(ingressContract.ADMIN_CONTRACT());

            require(adminContractAddress != address(0), "Ingress contract must have Admin contract registered");
            require(Admin(adminContractAddress).isAuthorized(sender), "Sender not authorized");
        }
        _;
    }

    function upgradeVersion(address _newVersion) public ownerExists(msg.sender) {
        emit VersionChange(latestVersion, _newVersion);
        latestVersion = _newVersion;
    }

    function updateNodeRules(address _nodeRules) public onlyNodeRules {
        emit VersionChange(nodeRules, _nodeRules);
        nodeRules = _nodeRules;
    }

    function size() public view onlyNodeRules returns (uint256) {
        return allowlist.length;
    }

    function exists(bytes32 _enodeHigh, bytes32 _enodeLow, bytes16 _ip, uint16 _port) public view onlyNodeRules returns (bool) {
        return indexOf[calculateKey(_enodeHigh, _enodeLow, _ip, _port)] != 0;
    }

    function groupConnectionAllowed(
        bytes32 sourceEnodeHigh,
        bytes32 sourceEnodeLow,
        bytes16 sourceEnodeIp,
        uint16 sourceEnodePort,
        bytes32 destinationEnodeHigh,
        bytes32 destinationEnodeLow,
        bytes16 destinationEnodeIp,
        uint16 destinationEnodePort) public view onlyNodeRules returns (bool){
        if (exists(sourceEnodeHigh,sourceEnodeLow,sourceEnodeIp,sourceEnodePort) && exists(destinationEnodeHigh,destinationEnodeLow,destinationEnodeIp,destinationEnodePort)){    
            Enode memory source = allowlist[indexOf[calculateKey(sourceEnodeHigh, sourceEnodeLow, sourceEnodeIp, sourceEnodePort)]-1];
            Enode memory destination = allowlist[indexOf[calculateKey(destinationEnodeHigh, destinationEnodeLow, destinationEnodeIp, destinationEnodePort)]-1];        

            return allowGroups[keccak256(abi.encodePacked(source.group, destination.group))];
        }
        else{
            return false;
        }
    }

    function addConnectionAllowed(bytes32 groupSource, bytes32 groupDestination)public onlyNodeRules returns(bool){
        allowGroups[keccak256(abi.encodePacked(groupSource, groupDestination))]=true;
        allowGroups[keccak256(abi.encodePacked(groupDestination, groupSource))]=true;
        return true;
    }

    function removeConnection(bytes32 groupSource, bytes32 groupDestination)public onlyNodeRules returns(bool){
        allowGroups[keccak256(abi.encodePacked(groupSource, groupDestination))]=false;
        allowGroups[keccak256(abi.encodePacked(groupDestination, groupSource))]=false;
        return true;
    }

    function add(bytes32 _enodeHigh, bytes32 _enodeLow, bytes16 _ip, uint16 _port, NodeType _nodeType, bytes6 _geoHash, string memory _name, string memory _organization, string memory _did, bytes32 _group) public onlyNodeRules returns (bool) {
        uint256 key = calculateKey(_enodeHigh, _enodeLow , _ip, _port);
        if (indexOf[key] == 0) {
            indexOf[key] = allowlist.push(Enode(_enodeHigh, _enodeLow, _ip, _port, _nodeType, _geoHash, _name, _organization, _did, _group));
            return true;
        }
        return false;
    }

    function remove(bytes32 _enodeHigh, bytes32 _enodeLow, bytes16 _ip, uint16 _port) public onlyNodeRules returns (bool) {
        uint256 key = calculateKey(_enodeHigh, _enodeLow,_ip, _port);
        uint256 index = indexOf[key];

        if (index > 0 && index <= allowlist.length) { //1 based indexing
            //move last item into index being vacated (unless we are dealing with last index)
            if (index != allowlist.length) {
                Enode memory lastEnode = allowlist[allowlist.length - 1];
                allowlist[index - 1] = lastEnode;
                indexOf[calculateKey(lastEnode.enodeHigh, lastEnode.enodeLow, lastEnode.ip, lastEnode.port)] = index;
            }

            //shrink array
            allowlist.length -= 1; // mythx-disable-line SWC-101
            indexOf[key] = 0;
            return true;
        }

        return false;
    }

    function getByIndex(uint index) external view returns (bytes32 enodeHigh, bytes32 enodeLow, bytes16 ip, uint16 port, NodeType nodeType, bytes6 geoHash, string memory name, string memory organization, string memory did, bytes32 group) {
        if (index >= 0 && index < size()) {
            Enode memory item = allowlist[index];
            return (item.enodeHigh, item.enodeLow, item.ip, item.port, item.nodeType, item.geoHash, item.name, item.organization, item.did, item.group);
        }
    }

    function getByEnode(
        bytes32 _enodeHigh,
        bytes32 _enodeLow,
        bytes16 _ip,
        uint16 _port)public view returns (NodeType nodeType, bytes6 geoHash, string memory name, string memory organization, string memory did, bytes32 group) {
        Enode memory item = allowlist[indexOf[calculateKey(_enodeHigh, _enodeLow, _ip, _port)]-1];
        if(item.port!=0){
            return (item.nodeType, item.geoHash, item.name, item.organization, item.did, item.group);
        }
    }

    function setValidateEnodeIdOnly (bool _onlyUseEnodeId) public onlyLatestVersion returns (bool) {
        if (onlyUseEnodeId == _onlyUseEnodeId) {
            return true;
        }

        // First we reset old map entries
        Enode memory entry;
        for (uint256 index = 0; index < allowlist.length; index++) {
            entry = allowlist[index];
            indexOf[calculateKey(entry.enodeHigh, entry.enodeLow, entry.ip, entry.port)] = 0;
        }

        onlyUseEnodeId = _onlyUseEnodeId;

        for (uint256 index = 0; index < allowlist.length; index++) {
            entry = allowlist[index];
            indexOf[calculateKey(entry.enodeHigh, entry.enodeLow, entry.ip, entry.port)] = index + 1;
        }

        return true;
    }

    function calculateKey(bytes32 _enodeHigh, bytes32 _enodeLow, bytes16 _ip, uint16 _port) public view onlyNodeRules returns(uint256) {
        if (!onlyUseEnodeId) {
            return uint256(keccak256(abi.encodePacked(_enodeHigh, _enodeLow, _ip, _port)));
        }
        return uint256(keccak256(abi.encodePacked(_enodeHigh,_enodeLow)));
    }
}