pragma experimental ABIEncoderV2;
pragma solidity 0.5.9;

import "./MultisignatureAdminProxy.sol";

contract MultisignatureRelay is MultisignatureAdminProxy{
    uint public constant MAX_OWNER_COUNT = 20;

    mapping (uint256 => Transaction) public transactions;
    mapping (uint256 => mapping (address => bool)) public confirmations;
    uint256[] private transactionIds;
    mapping (bytes32 => bool) private transactionHashes;
    uint public transactionCount;

    struct Transaction {
        uint256 transactionId;
        bytes32 trxHash;
        address to;
        bytes payload;
        bool executed;
    }

    modifier transactionIdExists(uint256 transactionId) {
        Transaction memory txn = transactions[transactionId];
        bytes memory payload = txn.payload;
        require(payload.length>0, "Transaction doesn't exist");
        _;
    }

    modifier confirmed(uint256 transactionId, address owner) {
        require(confirmations[transactionId][owner], "Transaction is not confirmed");
        _;
    }

    modifier notConfirmed(uint256 transactionId, address owner) {
        require(!confirmations[transactionId][owner], "Transaction is already confirmed");
        _;
    }

    modifier notExecuted(uint256 transactionId) {
        require(!transactions[transactionId].executed, "Transaction was executed");
        _;
    }

    modifier notNull(bytes memory payload) {
        require(payload.length > 0 , "payload should not be empty");
        _;
    }

    /// @dev Allows an owner to submit and confirm a transaction.
    /// @return Returns transaction ID.
    function submitTransaction(address _to, bytes memory _payload)
        public
        ownerExists(msg.sender)
        returns (bool)
    {
        uint256 transactionId = addTransaction(_to, _payload);
        confirmTransaction(transactionId);
    }

    /// @dev Allows an owner to confirm a transaction.
    /// @param transactionId Transaction ID.
    function confirmTransaction(uint256 transactionId)
        public
        ownerExists(msg.sender)
        transactionIdExists(transactionId)
        notConfirmed(transactionId, msg.sender)
    {
        confirmations[transactionId][msg.sender] = true;
        emit Confirmation(msg.sender,transactionId);
        executeTransaction(transactionId);
    }

    /// @dev Allows an owner to revoke a confirmation for a transaction.
    /// @param transactionId Transaction ID.
    function revokeConfirmation(uint256 transactionId)
        public
        ownerExists(msg.sender)
        confirmed(transactionId, msg.sender)
        notExecuted(transactionId)
    {
        confirmations[transactionId][msg.sender] = false;
        emit Revocation(msg.sender, transactionId);
        removeTransaction(transactionId);
    }

    /// @dev Allows anyone to execute a confirmed transaction.
    /// @param transactionId Transaction ID.
    function executeTransaction(uint256 transactionId)
        private
        ownerExists(msg.sender)
        confirmed(transactionId, msg.sender)
        notExecuted(transactionId)
    {
        if (isConfirmed(transactionId)) {
            Transaction storage txn = transactions[transactionId]; 
            (bool executed, bytes memory output) = _executeCall(txn.to,txn.payload);
            require(executed, "failed execution on storage"); //we don't need to save transactions after execution
            txn.executed = true;
            emit Execution(transactionId);
        }
    }

    /// @dev Allows anyone to remove a transaction.
    /// @param transactionId Transaction ID.
    function removeTransaction(uint256 transactionId)
        private
        ownerExists(msg.sender)
        notExecuted(transactionId)
    {
        if (getConfirmationCount(transactionId)==0) {
            Transaction storage txn = transactions[transactionId];
            txn.executed = true;
            emit RemoveTransaction(msg.sender, transactionId);
        }
    }

    /// @dev Returns the confirmation status of a transaction.
    /// @param transactionId Transaction ID.
    /// @return Confirmation status.
    function isConfirmed(uint256 transactionId)
        public
        view
        returns (bool)
    {
        uint256 required = getRequiredCount();
        uint count = 0;
        for (uint i=0; i<getOwnersSize(); i++) {
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
    function addTransaction(address _to, bytes memory _payload)
        private
        notNull(_payload)
        returns (uint256 transactionId)
    {
        bytes32 _trxHash = keccak256(abi.encodePacked(_to, _payload, block.number));  
        _transactionExists(_trxHash);
        transactionId = transactionCount;

        transactions[transactionId] = Transaction({
            transactionId: transactionId,
            trxHash: _trxHash,
            to: _to,
            payload: _payload,
            executed: false
        });
        transactionHashes[_trxHash] = true;
        transactionCount += 1;
        emit Submission(transactionId);
    }

    /*
     * Web3 call functions
     */
    /// @dev Returns number of confirmations of a transaction.
    /// @param transactionId Transaction ID.
    /// @return Number of confirmations.
    function getConfirmationCount(uint256 transactionId)
        public
        view
        returns (uint count)
    {
        for (uint i=0; i<getOwnersSize(); i++)
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
    function getConfirmations(uint256 transactionId)
        public
        view
        returns (address[] memory _confirmations)
    {
        address[] memory confirmationsTemp = new address[](getOwnersSize());
        uint count = 0;
        uint i;
        for (i=0; i<getOwnersSize(); i++)
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
    function getTransactionPayload(uint transactionId) public view returns (bytes memory, bool) {
        Transaction memory txn = transactions[transactionId];
        return (txn.payload, txn.executed);
    }

    /**
     * @param _trustedRecipient contract destination
     * @param _payload to execute in a recipient contract
     */
    function _executeCall(address _trustedRecipient, bytes memory _payload) private returns (bool success, bytes memory output){
        (success, output) = _trustedRecipient.call(_payload);
    }

    function _transactionExists(bytes32 _trxHash)private view returns (bool){ 
        require(!transactionHashes[_trxHash], "A same transaction already exist");
    }
    /*
     *  Events
     */
    event Confirmation(address indexed sender, uint256 indexed transactionId);
    event Revocation(address indexed sender, uint256 indexed transactionId);
    event Submission(uint256 indexed transactionId);
    event Execution(uint256 indexed transactionId);
    event RemoveTransaction(address indexed sender,uint256 indexed transactionId);
//    event ExecutionFailure(uint256 indexed transactionId, bytes payload);
}
