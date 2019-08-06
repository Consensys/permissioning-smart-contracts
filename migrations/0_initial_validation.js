const WhitelistUtils = require('../scripts/whitelist_utils');

module.exports = function(deployer) {
    console.log("   > Initial validations ...");
    if (WhitelistUtils.isInitialAdminAccountsAvailable()) {
        try {
            WhitelistUtils.getInitialAdminAccounts();
        } catch (e) {
            console.log("   > Invalid Initial Admin Accounts: " + e);
            throw e;
        }
    }

    if (WhitelistUtils.isInitialWhitelistedAccountsAvailable()) {
        try {
            WhitelistUtils.getInitialWhitelistedAccounts();
        } catch (e) {
            console.log("   > Invalid Initial Whitelisted Accounts: " + e);
            throw e;
        }
    }

    if (WhitelistUtils.isInitialWhitelistedNodesAvailable()) {
        try {
            WhitelistUtils.getInitialWhitelistedNodes();
        } catch (e) {
            console.log("   > Invalid Initial Whitelisted Nodes: " + e);
            throw e;
        }
    }  
};