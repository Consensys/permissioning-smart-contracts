pragma experimental ABIEncoderV2;
pragma solidity 0.5.9;

import "./NodeStorage.sol";

contract NodeStorageMultiSig is NodeStorage{
    uint public constant MAX_OWNER_COUNT = 20;

    mapping (uint => Transaction) public transactions;
    mapping (uint => mapping (address => bool)) public confirmations;
    uint public required;
    uint public transactionCount;

    struct Transaction {
        Enode node;
        bool executed;
    }

    modifier transactionExists(uint transactionId) {
        require(transactions[transactionId].node.port != 0);
        _;
    }

    modifier confirmed(uint transactionId, address owner) {
        require(confirmations[transactionId][owner]);
        _;
    }

    modifier notConfirmed(uint transactionId, address owner) {
        require(!confirmations[transactionId][owner]);
        _;
    }

    modifier notExecuted(uint transactionId) {
        require(!transactions[transactionId].executed);
        _;
    }

    modifier notNull(uint16 _port) {
        require(_port != 0);
        _;
    }

    modifier validRequirement(uint ownerCount, uint _required) {
        require(ownerCount <= MAX_OWNER_COUNT
            && _required <= ownerCount
            && _required != 0
            && ownerCount != 0);
        _;
    }

    /*
     * Public functions
     */
    /// @dev Contract constructor sets initial owners and required number of confirmations.
    /// @param _owners List of initial owners.
    /// @param _required Number of required confirmations.
    constructor(address _ingressContract, address[] memory _owners, uint _required)
        public
        validRequirement(_owners.length, _required)
    {
        ingressContract = NodeIngress(_ingressContract);
        onlyUseEnodeId = false;
        required = _required;
    }

    /// @dev Allows to change the number of required confirmations. Transaction has to be sent by wallet.
    /// @param _required Number of required confirmations.
    function changeRequirement(uint _required)
        public
        ownerExists()
        validRequirement(getOwnersSize(), _required)
    {
        required = _required;
        emit RequirementChange(_required);
    }

    /// @dev Allows an owner to submit and confirm a transaction.
    /// @return Returns transaction ID.
    function submitTransaction(bytes32 _enodeHigh, bytes32 _enodeLow, bytes16 _ip, uint16 _port, NodeType _nodeType, bytes6 _geoHash, string memory _name, string memory _organization, string memory _did, bytes32 _group)
        public
        returns (uint transactionId)
    {
        transactionId = addTransaction(_enodeHigh, _enodeLow, _ip, _port, _nodeType, _geoHash, _name, _organization, _did, _group);
        confirmTransaction(transactionId);
    }

    /// @dev Allows an owner to confirm a transaction.
    /// @param transactionId Transaction ID.
    function confirmTransaction(uint transactionId)
        public
        ownerExists()
        transactionExists(transactionId)
        notConfirmed(transactionId, msg.sender)
    {
        confirmations[transactionId][msg.sender] = true;
        emit Confirmation(msg.sender, transactionId);
        executeTransaction(transactionId);
    }

    /// @dev Allows an owner to revoke a confirmation for a transaction.
    /// @param transactionId Transaction ID.
    function revokeConfirmation(uint transactionId)
        public
        ownerExists()
        confirmed(transactionId, msg.sender)
        notExecuted(transactionId)
    {
        confirmations[transactionId][msg.sender] = false;
        emit Revocation(msg.sender, transactionId);
    }

    /// @dev Allows anyone to execute a confirmed transaction.
    /// @param transactionId Transaction ID.
    function executeTransaction(uint transactionId)
        public
        ownerExists()
        confirmed(transactionId, msg.sender)
        notExecuted(transactionId)
    {
        if (isConfirmed(transactionId)) {
            Transaction storage txn = transactions[transactionId];
            Enode memory enode = txn.node;
            txn.executed = true;
            if (add(enode.enodeHigh, enode.enodeLow, enode.ip, enode.port, enode.nodeType, enode.geoHash, enode.name, enode.organization, enode.did, enode.group))
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
    function addTransaction(bytes32 _enodeHigh, bytes32 _enodeLow, bytes16 _ip, uint16 _port, NodeType _nodeType, bytes6 _geoHash, string memory _name, string memory _organization, string memory _did, bytes32 _group)
        internal
        notNull(_port)
        returns (uint transactionId)
    {
        transactionId = transactionCount;
        Enode memory enode = Enode({
            enodeHigh: _enodeHigh,
            enodeLow: _enodeLow, 
            ip: _ip,
            port: _port,
            nodeType: _nodeType,
            geoHash: _geoHash,
            name: _name,
            organization: _organization,
            did: _did,
            group: _group
        });

        transactions[transactionId] = Transaction({
            node: enode,
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
    function getConfirmations(uint transactionId)
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