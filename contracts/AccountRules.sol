pragma solidity 0.5.9;

import "./AccountRulesProxy.sol";
import "./AccountRulesList.sol";
import "./Admin.sol";
import "./lib/LibBytesV06.sol";

contract AccountRules is AccountRulesProxy, AccountRulesList {

    using LibBytesV06 for bytes;

    event RelayHubSet(
        address newRelayHub
    );

    // in read-only mode rules can't be added/removed
    // this will be used to protect data when upgrading contracts
    bool private readOnlyMode = false;
    // version of this contract: semver like 1.2.14 represented like 001002014
    uint private version = 1000000;

    address private relayHub;

    modifier onlyOnEditMode() {
        require(!readOnlyMode, "In read only mode: rules cannot be modified");
        _;
    }

    modifier onlyAdmin() {
        require(isAuthorizedAdmin(msg.sender), "Sender is not admin authorized");
        _;
    }

    constructor (AccountIngress _ingressContract, AccountStorage _storage) public {
        setStorage(_storage);
        ingressContract = _ingressContract;
    }

    // VERSION
    function getContractVersion() external view returns (uint) {
        return version;
    }

    // READ ONLY MODE
    function isReadOnly() external view returns (bool) {
        return readOnlyMode;
    }

    function enterReadOnly() external onlyAdmin returns (bool) {
        require(readOnlyMode == false, "Already in read only mode");
        readOnlyMode = true;
        return true;
    }

    function exitReadOnly() external onlyAdmin returns (bool) {
        require(readOnlyMode == true, "Not in read only mode");
        readOnlyMode = false;
        return true;
    }

    function transactionAllowed(
        address sender,
        address target,
        uint256, // value
        uint256 gasPrice,
        uint256 gasLimit,
        bytes memory payload  //0xf8...+RLP user
    ) public view returns (bool) {
        if (gasPrice>0){
            return false;
        }

        if (!accountPermitted(sender) || !destinationPermitted(target)) {
            return false;
        }

        uint256 gasLimitRequired = payload.length * 105 + 300000; // dinamica + estática

        if (gasLimit<gasLimitRequired){
            return false;
        }

        bytes4 func = readBytes4(payload);

        if (func==0x1416862c || func==0x3ef54cef) {
            (uint gasLimitTx, address writerAddress, uint256 expiration) = getProtectionParameters(payload);
            
            if (gasLimit != gasLimitTx){
                return false;
            }

            if (expiration < block.timestamp){
                return false;
            }

            if (writerAddress != sender){
                return false;
            }
        }

        return true;
    }

    function accountPermitted(
        address _account
    ) public view returns (bool) {
        return existsAccount(_account);
    }

    function destinationPermitted(
        address _target
    ) public view returns (bool) {
        return existsTarget(_target);
    }
    
    function addAccount(
        address account,
        uint8 nodeType
    ) external onlyAdmin onlyOnEditMode returns (bool) {
        bool added = _addNewAccount(account);
        emit AccountAdded(added, account);
        if (added){
            bytes memory payload = abi.encodeWithSignature("addNode(address,uint8)",account,nodeType);
            (bool cResponse, bytes memory result) = relayHub.call(payload);
            added = cResponse;
            require (cResponse, string(result));
        }
        return added;
    }

    function removeAccount(
        address account
    ) external onlyAdmin onlyOnEditMode returns (bool) {
        bool removed = _removeAccount(account);
        emit AccountRemoved(removed, account);
        return removed;
    }

    function getSizeAccounts() external view returns (uint) {
        return _sizeAccounts();
    }

    function getSizeTargets() external view returns (uint) {
        return _sizeTargets();
    }

    function addTarget(
        address target
    ) public onlyAdmin onlyOnEditMode returns (bool) {
        bool added = _addNewTarget(target);
        emit TargetAdded(added, target);
        return added;
    }

    function removeTarget(
        address target
    ) public onlyAdmin onlyOnEditMode returns (bool) {
        bool removed = _removeTarget(target);
        emit TargetRemoved(removed, target);
        return removed;
    }

    function updateStorage_AccountRules(address _newAccountRules) public onlyAdmin returns (bool){
        return _updateStorage_AccountRules(_newAccountRules);
    }

    function isAuthorizedAdmin(address user) private view returns (bool) {
        address adminContractAddress = ingressContract.getContractAddress(ingressContract.ADMIN_CONTRACT());

        require(adminContractAddress != address(0), "Ingress contract must have Admin contract registered");
        return Admin(adminContractAddress).isAuthorized(user);
    }

    function setRelay(address _relayHub) public onlyAdmin returns (bool) {
        relayHub = _relayHub;
        emit RelayHubSet(_relayHub);
    }

    function readBytes4(bytes memory b) internal pure returns(bytes4 result){
        assembly {
            result := mload(add(b, 32))
            // Solidity does not require us to clean the trailing bytes.
            // We do it anyway
            result := and(result, 0xFFFFFFFF00000000000000000000000000000000000000000000000000000000)
        }
        return result;
    }

    // Besu add n bytes for padding at the end of data payload, it to complete 32 bytes 
    // (https://github.com/hyperledger/besu/blob/master/ethereum/permissioning/src/main/java/org/hyperledger/besu/ethereum/permissioning/TransactionSmartContractPermissioningController.java#L201)
    function getProtectionParameters(bytes memory b) internal pure returns(uint256, address, uint256){
        uint256 gasLimit = b.readUint256(4); //4, because gasLimit is first parameter of payload  
        uint256 sizeRLP = b.readUint256(164);  //164, because size of RLP is sixth parameter of payload
        uint256 remainder = (sizeRLP + 196) % 32;  //196 because data bytes start after 196 bytes
        uint256 paddingZeros = 32 - remainder + 4;  //complete to 32 bytes with zeros plus 4 bytes for function name
        if (paddingZeros >= 32){
            paddingZeros = paddingZeros - 32;
        }
        bytes memory nodeBytes = new bytes(20);
        nodeBytes = b.slice(b.length-20-32-paddingZeros,b.length-32-paddingZeros);
        bytes memory expirationBytes = new bytes(32);
        expirationBytes = b.slice(b.length-32-paddingZeros,b.length-paddingZeros);
        address nodeAddress = nodeBytes.readAddress(0);
        uint256 expiration = expirationBytes.readUint256(0);
        return (gasLimit, nodeAddress, expiration);
    }
}
