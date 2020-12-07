pragma solidity 0.5.9;



contract NodeRulesList {

    // struct size = 82 bytes
    struct enode {
        string enodeId;
        string ip;
        uint16 port;
    }

    enode[] public allowlist;
    mapping (uint256 => uint256) private indexOf; //1-based indexing. 0 means non-existent

    function calculateKey(string memory _enodeId, string memory _ip, uint16 _port) internal pure returns(uint256) {
        return uint256(keccak256(abi.encodePacked(_enodeId, _ip, _port)));
    }

    function size() internal view returns (uint256) {
        return allowlist.length;
    }

    function exists(string memory _enodeId, string memory _ip, uint16 _port) internal view returns (bool) {
        return indexOf[calculateKey(_enodeId, _ip, _port)] != 0;
    }

    function add(string memory _enodeId, string memory _ip, uint16 _port) internal returns (bool) {
        uint256 key = calculateKey(_enodeId, _ip, _port);
        if (indexOf[key] == 0) {
            indexOf[key] = allowlist.push(enode(_enodeId, _ip, _port));
            return true;
        }
        return false;
    }

    function remove(string memory _enodeId, string memory _ip, uint16 _port) internal returns (bool) {
        uint256 key = calculateKey(_enodeId, _ip, _port);
        uint256 index = indexOf[key];

        if (index > 0 && index <= allowlist.length) { //1 based indexing
            //move last item into index being vacated (unless we are dealing with last index)
            if (index != allowlist.length) {
                enode memory lastEnode = allowlist[allowlist.length - 1];
                allowlist[index - 1] = lastEnode;
                indexOf[calculateKey(lastEnode.enodeId, lastEnode.ip, lastEnode.port)] = index;
            }

            //shrink array
            allowlist.length -= 1; // mythx-disable-line SWC-101
            indexOf[key] = 0;
            return true;
        }

        return false;
    }
}
