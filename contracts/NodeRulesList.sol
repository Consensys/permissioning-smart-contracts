pragma solidity >=0.4.22 <0.6.0;

import "solidity-linked-list/contracts/StructuredLinkedList.sol";


contract NodeRulesList {
    using StructuredLinkedList for StructuredLinkedList.List;

    // struct size = 82 bytes
    struct enode {
        bytes32 enodeHigh;
        bytes32 enodeLow;
        bytes16 ip;
        uint16 port;
    }

    StructuredLinkedList.List private list;
    mapping (uint256 => enode) private enodeMapping;

    function calculateKey(bytes32 _enodeHigh, bytes32 _enodeLow, bytes16 _ip, uint16 _port) internal pure returns(uint256) {
        return uint256(keccak256(abi.encodePacked(_enodeHigh, _enodeLow, _ip, _port)));
    }

    function size() internal view returns (uint256) {
        return list.sizeOf();
    }

    function exists(bytes32 _enodeHigh, bytes32 _enodeLow, bytes16 _ip, uint16 _port) internal view returns (bool) {
        return list.nodeExists(calculateKey(_enodeHigh, _enodeLow, _ip, _port));
    }

    function add(bytes32 _enodeHigh, bytes32 _enodeLow, bytes16 _ip, uint16 _port) internal returns (bool) {
        uint key = calculateKey(_enodeHigh, _enodeLow, _ip, _port);
        if (!list.nodeExists(key)) {
            enode memory newEnode = enode(
                _enodeHigh,
                _enodeLow,
                _ip,
                _port
            );
            enodeMapping[key] = newEnode;

            return list.push(calculateKey(_enodeHigh, _enodeLow, _ip, _port), false);
        } else {
            return false;
        }
    }

    function remove(bytes32 _enodeHigh, bytes32 _enodeLow, bytes16 _ip, uint16 _port) internal returns (bool) {
        uint key = calculateKey(_enodeHigh, _enodeLow, _ip, _port);
        if (list.nodeExists(key)) {
            delete enodeMapping[key];
            return list.remove(key) != 0 ? true : false;
        } else {
            return false;
        }
    }

    function get(uint _index) internal view returns (bool _exists, bytes32 _enodeHigh, bytes32 _enodeLow, bytes16 _ip, uint16 _port) {
        uint listSize = list.sizeOf();
        if (_index >= listSize) {
            return (false, bytes32(0), bytes32(0), bytes16(0), uint16(0));
        }

        uint counter = 0;
        uint pointer = 0;
        bool hasFound = false;

        while(counter <= listSize) {
            (bool nodeExists, uint256 prev, uint256 next) = list.getNode(pointer);
            if (nodeExists) {
                if (counter == _index + 1) {
                    hasFound = true;
                    break;
                } else {
                    counter++;
                    pointer = next;
                }
            } else {
                break;
            }
            //Getting rid of unused variable warning
            prev;
        }

        if (hasFound) {
            enode memory e = enodeMapping[pointer];
            return (true, e.enodeHigh, e.enodeLow, e.ip, e.port);
        } else {
            return (false, bytes32(0), bytes32(0), bytes16(0), uint16(0));
        }
    }
}
