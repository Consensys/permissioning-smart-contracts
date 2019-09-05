pragma solidity 0.5.9;

interface AdminProxy {
    function isAuthorized(address source) external view returns (bool);
}
