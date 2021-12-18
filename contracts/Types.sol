pragma solidity 0.5.9;

contract Types {

enum NodeType{
        Boot,
        Validator,
        Writer,
        Observer,
        Other
    }

    // struct size = 82 bytes
    struct Enode {
        bytes32 enodeHigh;
        bytes32 enodeLow;
        bytes16 ip;
        uint16 port;
        NodeType nodeType;
        bytes6 geoHash;
        string name;
        string organization;
        string did;
        bytes32 group;
    }
}