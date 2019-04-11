pragma solidity >=0.4.22 <0.6.0;

import "./AdminProxy.sol";
import "./RulesProxy.sol";
import "./Ingress.sol";


contract Rules is AdminProxy, RulesProxy {
    // These will be assigned at the construction
    // phase, where `msg.sender` is the account
    // creating this contract.
    address public admin = msg.sender;
    bool readOnlyMode = false;
    struct Admin {
        address adminAddress;
        bool active;
    }
    mapping(address => Admin) admins;
    uint adminCount;
    address[] adminKeys;
    // version of this contract: semver like 1.2.14 represented like 001002014
    uint version = 1000000;

    address ingressContractAddress;

    struct Enode {
        bytes next;
        bytes prev;
        bytes32 enodeHigh;
        bytes32 enodeLow;
        bytes16 enodeHost;
        uint16 enodePort;
    }
    mapping(bytes => Enode) private whitelist; // should there be a size for the whitelists?

    // keys
    uint countWhitelist;
    bytes[] keysWhitelist;
    // head of linked list
    bytes headWhitelist;

    // AUTHORIZATION
    constructor (address ingressAddress) public {
        // add the deploying contract address as first admin
        Admin memory orig = Admin(msg.sender, true);
        admins[msg.sender] = orig;
        adminKeys.push(msg.sender);
        adminCount = adminCount + 1;

        // Record the Ingress contract's address
        ingressContractAddress = ingressAddress;
    }

    // AUTHORIZATION: LIST OF ADMINS
    modifier onlyAdmin()
    {
        require(
            admins[msg.sender].adminAddress != address(0),
            "Sender not authorized."
        );
        require(admins[msg.sender].active == true, "Sender not authorized");
        _;
    }

    function isAuthorized(address source) public view returns (bool) {
        return admins[source].active;
    }

    function addAdmin(address _newAdmin) public onlyAdmin returns (bool) {
        if (admins[_newAdmin].active) {
            return false;
        }
        adminKeys.push(_newAdmin);
        Admin memory newAdmin = Admin(_newAdmin, true);
        admins[_newAdmin] = newAdmin;
        adminCount = adminCount + 1;
        return true;
    }

    function removeAdmin(address oldAdmin) public onlyAdmin returns (bool) {
        admins[oldAdmin].active = false;
        adminCount = adminCount - 1;
        return true;
    }

    // return list of admins
    function getAllAdmins() public view returns (address[] memory){
        address[] memory ret = new address[](adminCount);
        Admin memory a;
        for (uint i = 0; i < adminKeys.length; i++) {
            a = admins[adminKeys[i]];
            if (a.active) {
                ret[i] = admins[adminKeys[i]].adminAddress;
            }
        }
        return ret;
    }

    // READ ONLY MODE
    function isReadOnly() public view returns (bool) {
        return readOnlyMode;
    }

    function enterReadOnly() public onlyAdmin returns (bool) {
        require(readOnlyMode == false, "Already in read only mode");
        readOnlyMode = true;
        return true;
    }

    function exitReadOnly() public onlyAdmin returns (bool) {
        require(readOnlyMode == true, "Not in read only mode");
        readOnlyMode = false;
        return true;
    }

    // VERSION
    function getContractVersion() public view returns (uint) {
        return version;
    }

    // RULES - IS CONNECTION ALLOWED
    function connectionAllowed(
        bytes32 sourceEnodeHigh,
        bytes32 sourceEnodeLow,
        bytes16 sourceEnodeIp,
        uint16 sourceEnodePort,
        bytes32 destinationEnodeHigh,
        bytes32 destinationEnodeLow,
        bytes16 destinationEnodeIp,
        uint16 destinationEnodePort
    ) public view returns (bool) {
        return (
            enodeAllowed(
                sourceEnodeHigh,
                sourceEnodeLow,
                sourceEnodeIp,
                sourceEnodePort
            ) && enodeAllowed(
                destinationEnodeHigh,
                destinationEnodeLow,
                destinationEnodeIp,
                destinationEnodePort
            )
        );
    }

    // RULES - IS ENODE ALLOWED
    function enodeAllowed(
        bytes32 sourceEnodeHigh,
        bytes32 sourceEnodeLow,
        bytes16 sourceEnodeIp,
        uint16 sourceEnodePort
    ) public view returns (bool){
        bytes memory key = computeKey(
            sourceEnodeHigh,
            sourceEnodeLow,
            sourceEnodeIp,
            sourceEnodePort
        );
        Enode storage whitelistSource = whitelist[key];
        if (enodeExists(whitelistSource)) {
            return true;
        }
    }

    // RULES MODIFIERS - ADD
    function addEnode(
        bytes32 enodeHigh,
        bytes32 enodeLow,
        bytes16 enodeIp,
        uint16 enodePort
    ) public onlyAdmin returns (bool) {
        require(readOnlyMode == false, "In read only mode: rules cannot be modified");
        bytes memory key = computeKey(
            enodeHigh,
            enodeLow,
            enodeIp,
            enodePort
        );
        // return false if already in the list
        if (enodeExists(whitelist[key])) {
            return false;
        }
        bytes memory next;
        bytes memory prev;
        if (countWhitelist == 0) {
            next = key;
            prev = key;
            headWhitelist = key;
        } else {
            next = whitelist[headWhitelist].next;
            prev = headWhitelist;
        }
        Enode memory newEnode = Enode(
            next,
            prev,
            enodeHigh,
            enodeLow,
            enodeIp,
            enodePort
        );
        whitelist[key] = newEnode;
        keysWhitelist.push(key);
        countWhitelist = countWhitelist + 1;
        whitelist[newEnode.next].prev = key;
        whitelist[headWhitelist].next = key;

        triggerRulesChangeEvent(false);

        return true;
    }

    // RULES MODIFIERS - REMOVE
    function removeEnode(
        bytes32 enodeHigh,
        bytes32 enodeLow,
        bytes16 enodeIp,
        uint16 enodePort
    ) public onlyAdmin returns (bool) {
        require(readOnlyMode == false, "In read only mode: rules cannot be modified");
        bytes memory key = computeKey(
            enodeHigh,
            enodeLow,
            enodeIp,
            enodePort
        );
        if (!enodeExists(whitelist[key])) {
            return false;
        }
        Enode memory e = whitelist[key];
        // TODO only if removing the head, reset the head to head.next
        headWhitelist = e.next;
        whitelist[e.prev].next = e.next;
        whitelist[e.next].prev = e.prev;
        countWhitelist = countWhitelist - 1;
        delete whitelist[key];

        triggerRulesChangeEvent(true);

        return true;
    }

    // RULES - LINKED LIST
    function getHeadEnode() public view returns (bytes memory, bytes memory, bytes32, bytes32, bytes16, uint16) {
        require(countWhitelist > 0, "Whitelist is empty");
        return getEnode(headWhitelist);
    }

    function getEnode(bytes memory key) public view returns (bytes memory, bytes memory, bytes32 , bytes32 , bytes16 , uint16) {
        Enode memory e = whitelist[key];
        return (e.next, e.prev, e.enodeHigh, e.enodeLow, e.enodeHost, e.enodePort);
    }

    // RULES - UTILS
    function getWhitelistKey(uint index) public view returns(bytes memory) {
        return keysWhitelist[index];
    }

    function enodeExists(Enode memory enode) private pure returns (bool) {
        // TODO do we need to check all fields?
        return enode.enodeHost > 0 && enode.enodeHigh > 0 && enode.enodeLow > 0;
    }

    function computeKey(
        bytes32 enodeHigh,
        bytes32 enodeLow,
        bytes16 enodeHostIp,
        uint16 enodePort
    ) public pure returns (bytes memory) {
        return abi.encode(
            enodeHigh,
            enodeLow,
            enodeHostIp,
            enodePort
        );
    }

    function getKeyCount() public view returns (uint) {
        return keysWhitelist.length;
    }

    function triggerRulesChangeEvent(bool addsRestrictions) public {
        Ingress i = Ingress(ingressContractAddress);
        i.emitRulesChangeEvent(addsRestrictions);
    }
}
