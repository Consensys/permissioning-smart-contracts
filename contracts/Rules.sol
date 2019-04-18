pragma solidity >=0.4.22 <0.6.0;

import "./RulesProxy.sol";
import "./Ingress.sol";
import "./Admin.sol";


contract Rules is RulesProxy {

    // on read-only mode rules can't be added/removed
    bool readOnlyMode = false;
    // version of this contract: semver like 1.2.14 represented like 001002014
    uint version = 1000000;

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

    address private ingressContractAddress;

    modifier onlyOnEditMode() {
        require(!readOnlyMode, "In read only mode: rules cannot be modified");
        _;
    }

    modifier onlyAdmin() {
        Ingress ingressContract = Ingress(ingressContractAddress);
        address adminContractAddress = ingressContract.getContractAddress(ingressContract.ADMIN_CONTRACT());

        require(adminContractAddress != address(0), "Ingress contract must have Admin contract registered");
        require(Admin(adminContractAddress).isAuthorized(msg.sender), "Sender not authorized");
        _;
    }

    constructor (address ingressAddress) public {
        ingressContractAddress = ingressAddress;
    }

    // VERSION
    function getContractVersion() public view returns (uint) {
        return version;
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
    ) public view returns (bytes32) {
        if (
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
        ) {
            return 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
        } else {
            return 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
        }
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
    ) public onlyAdmin onlyOnEditMode returns (bool) {
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
    ) public onlyAdmin onlyOnEditMode returns (bool) {
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

        // update keys
        for (uint i = 0; i < keysWhitelist.length; i++) {
            if (bytesEqual(keysWhitelist[i], key)) {
                keysWhitelist[i] = keysWhitelist[keysWhitelist.length - 1];
                delete keysWhitelist[keysWhitelist.length - 1];
                keysWhitelist.length--;
            }
        }

        // update linked list
        headWhitelist = e.next;
        whitelist[e.prev].next = e.next;
        whitelist[e.next].prev = e.prev;
        countWhitelist = countWhitelist - 1;
        delete whitelist[key];

        triggerRulesChangeEvent(true);

        return true;
    }

    function bytesEqual(bytes memory a, bytes memory b) public pure returns(bool) {

        if (a.length != b.length) {
            return false;
        } else {
            // check each byte
            for (uint j = 0; j < b.length; j++) {
                if (a[j] != b[j]) {
                    return false;
                }
            }
        }
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
        Ingress(ingressContractAddress).emitRulesChangeEvent(addsRestrictions);
    }
}
