pragma solidity >=0.4.22 <0.6.0;

import "solidity-linked-list/contracts/StructuredLinkedList.sol";


contract AccountRulesList {
    using StructuredLinkedList for StructuredLinkedList.List;

    StructuredLinkedList.List private list;
    mapping (uint256 => address) private accountMapping;

    function calculateKey(address _account) internal pure returns(uint256) {
        return uint256(keccak256(abi.encodePacked(_account)));
    }

    function size() internal view returns (uint256) {
        return list.sizeOf();
    }

    function exists(address _account) internal view returns (bool) {
        return list.nodeExists(calculateKey(_account));
    }

    function add(address _account) internal returns (bool) {
        uint256 key = calculateKey(_account);
        if (!list.nodeExists(key)) {
            accountMapping[key] = _account;

            return list.push(key, false);
        } else {
            return false;
        }
    }

    function remove(address _account) internal returns (bool) {
        uint256 key = calculateKey(_account);
        if (list.nodeExists(key)) {
            delete accountMapping[key];
            return list.remove(key) != 0 ? true : false;
        } else {
            return false;
        }
    }

    function get(uint _index) internal view returns (bool _exists, address _account) {
        uint listSize = list.sizeOf();
        if (_index >= listSize) {
            return (false, address(0));
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
            address a = accountMapping[pointer];
            return (true, a);
        } else {
            return (false, address(0));
        }
    }
}
