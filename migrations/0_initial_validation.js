const whitelist_utils = require('../scripts/whitelist_utils');

module.exports = function(deployer) {
    console.log("   > Initial validations ...");
    if (whitelist_utils.isInitialAdminAccountsAvailable()) {
        try {
            whitelist_utils.getInitialAdminAccounts();
        } catch (e) {
            console.log("   > Invalid Initial Admin Accounts: " + e);
            throw e;
        }
    }

    if (whitelist_utils.isInitialWhitelistedAccountsAvailable()) {
        try {
            whitelist_utils.getInitialWhitelistedAccounts();
        } catch (e) {
            console.log("   > Invalid Initial Whitelisted Accounts: " + e);
            throw e;
        }
    }

    if (whitelist_utils.isInitialWhitelistedNodesAvailable()) {
        try {
            whitelist_utils.getInitialWhitelistedNodes();
        } catch (e) {
            console.log("   > Invalid Initial Whitelisted Nodes: " + e);
            throw e;
        }
    }  
};