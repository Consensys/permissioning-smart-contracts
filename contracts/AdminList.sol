pragma solidity 0.5.9;



contract AdminList {
    event AdminAdded(
        bool adminAdded,
        address account,
        string message
    );

    event AdminRemoved(
        bool adminRemoved,
        address account
    );

    address[] public whitelist;
    mapping (address => uint256) private indexOf; //1 based indexing. 0 means non-existent

    function size() internal view returns (uint256) {
        return whitelist.length;
    }

    function exists(address _account) internal view returns (bool) {
        return indexOf[_account] != 0;
    }

    function add(address _account) internal returns (bool) {
        if (indexOf[_account] == 0) {
            indexOf[_account] = whitelist.push(_account);
            return true;
        }
        return false;
    }

    function addAll(address[] memory accounts) internal returns (bool) {
        bool allAdded = true;
        for (uint i = 0; i<accounts.length; i++) {
            if (msg.sender == accounts[i]) {
                emit AdminAdded(false, accounts[i], "Adding own account as Admin is not permitted");
                allAdded = allAdded && false;
            } else if (exists(accounts[i])) {
                emit AdminAdded(false, accounts[i], "Account is already an Admin");
                allAdded = allAdded && false;
            }  else {
                bool result = add(accounts[i]);
                string memory message = result ? "Admin account added successfully" : "Account is already an Admin";
                emit AdminAdded(result, accounts[i], message);
                allAdded = allAdded && result;
            }
        }

        return allAdded;
    }

    function remove(address _account) internal returns (bool) {
        uint256 index = indexOf[_account];
        if (index > 0 && index <= whitelist.length) { //1-based indexing
            //move last address into index being vacated (unless we are dealing with last index)
            if (index != whitelist.length) {
                address lastAccount = whitelist[whitelist.length - 1];
                whitelist[index - 1] = lastAccount;
                indexOf[lastAccount] = index;
            }

            //shrink whitelist array
            whitelist.length -= 1;
            indexOf[_account] = 0;
            return true;
        }
        return false;
    }
}
