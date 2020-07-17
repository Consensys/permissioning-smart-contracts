pragma solidity 0.5.9;


contract AccountRulesList {
    event AccountAdded(
        bool accountAdded,
        address accountAddress
    );

    event AccountRemoved(
        bool accountRemoved,
        address accountAddress
    );

    address[] public allowlist;
    mapping (address => uint256) private indexOf; //1 based indexing. 0 means non-existent

    function size() internal view returns (uint256) {
        return allowlist.length;
    }

    function exists(address _account) internal view returns (bool) {
        return indexOf[_account] != 0;
    }

    function add(address _account) internal returns (bool) {
        if (indexOf[_account] == 0) {
            indexOf[_account] = allowlist.push(_account);
            return true;
        }
        return false;
    }

    function addAll(address[] memory accounts) internal returns (bool) {
        bool allAdded = true;
        for (uint i = 0; i < accounts.length; i++) {
            bool added = add(accounts[i]);
            emit AccountAdded(added, accounts[i]);
            allAdded = allAdded && added;
        }

        return allAdded;
    }

    function remove(address _account) internal returns (bool) {
        uint256 index = indexOf[_account];
        if (index > 0 && index <= allowlist.length) { //1-based indexing
            //move last address into index being vacated (unless we are dealing with last index)
            if (index != allowlist.length) {
                address lastAccount = allowlist[allowlist.length - 1];
                allowlist[index - 1] = lastAccount;
                indexOf[lastAccount] = index;
            }

            //shrink array
            allowlist.length -= 1;
            indexOf[_account] = 0;
            return true;
        }
        return false;
    }
}
