pragma solidity >=0.4.22 <0.6.0;

import "solidity-linked-list/contracts/StructuredLinkedList.sol";


//TODO change methods to internal and create exposed contract for testing
contract AdminList {
    using StructuredLinkedList for StructuredLinkedList.List;

    StructuredLinkedList.List private list;

    function size() public view returns (uint256) {
        return list.sizeOf();
    }

    function exists(address _address) public view returns (bool) {
        return list.nodeExists(uint256(_address));
    }

    function add(address _address) public returns (bool) {
        return list.push(uint(_address), true);
    }

    function remove(address _address) public returns (bool) {
        uint node = uint(_address);
        return list.remove(node) != 0 ? true : false;
    }

    function get(uint index) public view returns (bool _exists, address _address) {
        uint listSize = list.sizeOf();
        if (index >= listSize) {
            return (false, address(0));
        }

        uint counter = 0;
        uint pointer = 0;
        bool hasFound = false;

        while(counter <= listSize) {
            (bool nodeExists, uint256 prev, uint256 next) = list.getNode(pointer);
            if (nodeExists) {
                if (counter == index + 1) {
                    hasFound = true;
                    break;
                } else {
                    counter++;
                    pointer = prev;
                }
            } else {
                break;
            }
            //Getting rid of unused variable warning
            next;
        }

        if (hasFound) {
            return (true, address(pointer));
        } else {
            return (false, address(0));
        }
    }
}