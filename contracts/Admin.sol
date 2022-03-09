pragma solidity 0.5.9;

import "./AdminProxy.sol";
import "./AdminList.sol";


contract Admin is AdminProxy, AdminList {
    uint public constant MAX_OWNER_COUNT = 20;

    mapping (uint => Transaction) public transactions;
    mapping (uint => mapping (address => bool)) public confirmations;
    uint public required;
    uint public transactionCount;

    struct Transaction {
        uint transactionId;
        address newAdmin;
        bool executed;
    }

    modifier transactionExists(uint transactionId) {
        Transaction memory txn = transactions[transactionId];
        require(txn.newAdmin != address(0), "Transaction doesn't exist");
        _;
    }

    modifier confirmed(uint transactionId) {
        require(confirmations[transactionId][msg.sender], "Transaction is not confirmed");
        _;
    }

    modifier notConfirmed(uint transactionId) {
        require(!confirmations[transactionId][msg.sender], "Transaction is already confirmed");
        _;
    }

    modifier notExecuted(uint transactionId) {
        require(!transactions[transactionId].executed, "Transaction was executed");
        _;
    }

    modifier notNull(address _account) {
        require(_account != address(0), "account should be different to 0");
        _;
    }

    modifier validRequirement(uint ownerCount, uint _required) {
        require(ownerCount <= MAX_OWNER_COUNT
            && _required <= ownerCount
            && _required != 0
            && ownerCount != 0);
        _;
    }

    /// @dev Allows to change the number of required confirmations. Transaction has to be sent by wallet.
    /// @param _required Number of required confirmations.
    function changeRequirement(uint _required)
        public
        onlyAdmin()
        validRequirement(size(), _required)
    {
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
        uint256 transactionId = addTransaction(_newAdmin);
        confirmTransaction(transactionId);
    }

    /// @dev Allows an owner to confirm a transaction.
    /// @param transactionId Transaction ID.
    function confirmTransaction(uint transactionId)
        public
        onlyAdmin()
        transactionExists(transactionId)
        notConfirmed(transactionId)
    {
        confirmations[transactionId][msg.sender] = true;
        emit Confirmation(msg.sender, transactionId);
        executeTransaction(transactionId);
    }

    /// @dev Allows an owner to revoke a confirmation for a transaction.
    /// @param transactionId Transaction ID.
    function revokeConfirmation(uint transactionId)
        public
        onlyAdmin()
        confirmed(transactionId)
        notExecuted(transactionId)
    {
        confirmations[transactionId][msg.sender] = false;
        emit Revocation(msg.sender, transactionId);
    }

    /// @dev Allows anyone to execute a confirmed transaction.
    /// @param transactionId Transaction ID.
    function executeTransaction(uint transactionId)
        private
        onlyAdmin()
        confirmed(transactionId)
        notExecuted(transactionId)
    {
        if (isConfirmed(transactionId)) {
            Transaction storage txn = transactions[transactionId];
            txn.executed = true;
            if (_addAdmin(txn.newAdmin))
                emit Execution(transactionId);
            else {
                emit ExecutionFailure(transactionId);
                txn.executed = false;
            }
        }
    }

    /// @dev Returns the confirmation status of a transaction.
    /// @param transactionId Transaction ID.
    /// @return Confirmation status.
    function isConfirmed(uint transactionId)
        public
        view
        returns (bool)
    {
        uint count = 0;
        for (uint i=0; i<size(); i++) {
            if (confirmations[transactionId][getOwner(i)])
                count += 1;
            if (count == required)
                return true;
        }
    }

    /*
     * Internal functions
     */
    /// @dev Adds a new transaction to the transaction mapping, if transaction does not exist yet.
    /// @return Returns transaction ID.
    function addTransaction(address _newAdmin)
        private
        notNull(_newAdmin)
        returns (uint transactionId)
    {
        transactionId = transactionCount;

        transactions[transactionId] = Transaction({
            transactionId:transactionId,
            newAdmin: _newAdmin,
            executed: false
        });
        transactionCount += 1;
        emit Submission(transactionId);
    }

    /*
     * Web3 call functions
     */
    /// @dev Returns number of confirmations of a transaction.
    /// @param transactionId Transaction ID.
    /// @return Number of confirmations.
    function getConfirmationCount(uint transactionId)
        public
        view
        returns (uint count)
    {
        for (uint i=0; i<size(); i++)
            if (confirmations[transactionId][getOwner(i)])
                count += 1;
    }

    /// @dev Returns total number of transactions after filters are applied.
    /// @param pending Include pending transactions.
    /// @param executed Include executed transactions.
    /// @return Total number of transactions after filters are applied.
    function getTransactionCount(bool pending, bool executed)
        public
        view
        returns (uint count)
    {
        for (uint i=0; i<transactionCount; i++)
            if (   pending && !transactions[i].executed
                || executed && transactions[i].executed)
                count += 1;
    }

    /// @dev Returns array with owner addresses, which confirmed transaction.
    /// @param transactionId Transaction ID.
    /// @return Returns array of owner addresses.
    function getConfirmations(uint transactionId)
        public
        view
        returns (address[] memory _confirmations)
    {
        address[] memory confirmationsTemp = new address[](size());
        uint count = 0;
        uint i;
        for (i=0; i<size(); i++)
            if (confirmations[transactionId][getOwner(i)]) {
                confirmationsTemp[count] = getOwner(i);
                count += 1;
            }
        _confirmations = new address[](count);
        for (i=0; i<count; i++)
            _confirmations[i] = confirmationsTemp[i];
    }

    /// @dev Returns list of transaction IDs in defined range.
    /// @param from Index start position of transaction array.
    /// @param to Index end position of transaction array.
    /// @param pending Include pending transactions.
    /// @param executed Include executed transactions.
    /// @return Returns array of transaction IDs.
    function getTransactionIds(uint from, uint to, bool pending, bool executed)
        public
        view
        returns (uint[] memory _transactionIds)
    {
        uint[] memory transactionIdsTemp = new uint[](transactionCount);
        uint count = 0;
        uint i;
        for (i=0; i<transactionCount; i++)
            if (   pending && !transactions[i].executed
                || executed && transactions[i].executed)
            {
                transactionIdsTemp[count] = i;
                count += 1;
            }
        _transactionIds = new uint[](to - from);
        for (i=from; i<to; i++)
            _transactionIds[i - from] = transactionIdsTemp[i];
    }

    /// @dev Returns list of transaction  in defined range.
    /// @param transactionId Transaction ID.
    /// @return Returns transaction
    function getTransaction(uint transactionId) public view returns (address, bool, uint) {
         Transaction memory txn = transactions[transactionId];
        return (txn.newAdmin,txn.executed , txn.transactionId);
    }

    modifier onlyAdmin() {
        require(isAuthorized(msg.sender), "Sender not authorized");
        _;
    }

    modifier notSelf(address _address) {
        require(msg.sender != _address, "Cannot invoke method with own account as parameter");
        _;
    }

    constructor(address[] memory _owners, uint _required) public validRequirement(_owners.length, _required){
        required = _required;
        addAll(_owners);
    }

    function isAuthorized(address _address) public view returns (bool) {
        return exists(_address);
    }

    function _addAdmin(address _address) internal returns (bool) {
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
        bool removed = remove(_address);
        emit AdminRemoved(removed, _address);
        return removed;
    }

    function getOwners() external view returns (address[] memory){
        return owners; // mythx-disable-line SWC-128
    }

    function addAdmins(address[] calldata accounts) external onlyAdmin returns (bool) {
        return addAll(accounts);
    }

    /*
     *  Events
     */
    event Confirmation(address indexed sender, uint indexed transactionId);
    event Revocation(address indexed sender, uint indexed transactionId);
    event Submission(uint indexed transactionId);
    event Execution(uint indexed transactionId);
    event ExecutionFailure(uint indexed transactionId);
    event RequirementChange(uint required);
}
