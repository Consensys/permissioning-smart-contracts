pragma solidity 0.5.9;

import "./AdminProxy.sol";
import "./AdminList.sol";
import "./MultisignatureRelay.sol";
import "./lib/LibBytesV06.sol";

contract Admin is AdminProxy, MultisignatureRelay, AdminList {
    using LibBytesV06 for bytes;

    uint public constant MAX_OWNER_COUNT = 20;

    mapping (uint => Transaction) public transactions;
    mapping (uint => mapping (address => bool)) public confirmations;
    uint256 public required;

    modifier validRequirement(uint ownerCount, uint _required) {
        require(ownerCount <= MAX_OWNER_COUNT
            && _required <= ownerCount
            && _required != 0
            && ownerCount != 0, "Rule is not correct");
        _;
    }

    /// @dev Allows to change the number of required confirmations. Transaction has to be sent by wallet.
    /// @param _required Number of required confirmations.
    function changeRequirement(uint256 _required)
        public
        onlyAdmin()
        validRequirement(size(), _required)
        returns (bool)
    {
        bytes memory _payload = abi.encodeWithSignature("executeChangeRequirement(uint256)", _required);
        return submitTransaction(address(this), _payload);
    }

    function executeChangeRequirement(uint256 _required) onlySelfContract public {
        required = _required;
        emit RequirementChange(_required);
    }

    /// @dev Allows an owner to submit and confirm a transaction.
    /// @return Returns transaction ID.
    function addAdmin(address _newAdmin)
        public
        onlyAdmin()
        returns (bool)
    {
        bytes memory _payload = abi.encodeWithSignature("executeAddAdmin(address)", _newAdmin);
        return submitTransaction(address(this), _payload);
    }

    /// @dev Returns list of transaction  in defined range.
    /// @param transactionId Transaction ID.
    /// @return Returns transaction
    function getTransaction(uint transactionId) public view returns (address, bool, uint) {
        (bytes memory payload, bool executed) = getTransactionPayload(transactionId);
        address _accountAdmin = abi.decode(payload.slice(4,payload.length),(address));
        return (_accountAdmin, executed , transactionId);
    }

    modifier onlyAdmin() {
        require(isAuthorized(msg.sender), "Sender not authorized");
        _;
    }

    modifier notSelf(address _address) {
        require(msg.sender != _address, "Cannot invoke method with own account as parameter");
        _;
    }

    modifier onlySelfContract() {
        require(msg.sender == address(this), "Sender is not same contract");
        _;
    }

    constructor(address[] memory _owners, uint _required, AccountIngress _ingressContract) public validRequirement(_owners.length, _required){
        ingressContract = _ingressContract;
        required = _required;
        addAll(_owners);
    }

    function isAuthorized(address _address) public view returns (bool) {
        return exists(_address);
    }

    function executeAddAdmin(address _address) public onlySelfContract returns (bool) {
        if (msg.sender == _address) {
            emit AdminAdded(false, _address, "Adding own account as Admin is not permitted");
            return false;
        } else {
            bool result = add(_address);
            string memory message = result ? "Admin account added successfully" : "Account is already an Admin";
            emit AdminAdded(result, _address, message);
            return result;
        }
    }

    function removeAdmin(address _address) external onlyAdmin notSelf(_address) returns (bool) {
        bytes memory _payload = abi.encodeWithSignature("executeRemoveAdmin(address)", _address);
        return submitTransaction(address(this), _payload);
    }

    function executeRemoveAdmin(address _account) public onlySelfContract {
        bool removed = remove(_account);
        emit AdminRemoved(removed, _account);
    }

    function getOwners() external view returns (address[] memory){
        return owners; // mythx-disable-line SWC-128
    }

    function addAdmins(address[] calldata accounts) external onlyAdmin returns (bool) {
        return addAll(accounts);
    }

    function getRequired() public view returns (uint256){
        return required;
    }

    /*
     *  Events
     */
    event RequirementChange(uint required);
}
