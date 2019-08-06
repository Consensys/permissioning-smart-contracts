const WhitelistUtils = require('../scripts/whitelist_utils');

module.exports = function(deployer) {
    console.log("   > Initial validations ...");
    if (WhitelistUtils.isInitialAdminAccountsAvailable()) {
        try {
            console.log("   > Validating Initial Admin Account Addresses ...");
            WhitelistUtils.getInitialAdminAccounts();
        } catch (e) {
            console.log("   > Invalid Initial Admin Account Address: " + e);
            throw e;
        }
    }

    if (WhitelistUtils.isInitialWhitelistedAccountsAvailable()) {
        try {
            console.log("   > Validating Initial Whitelisted Account Addresses ...");
            WhitelistUtils.getInitialWhitelistedAccounts();
        } catch (e) {
            console.log("   > Invalid Initial Whitelisted Account Address: " + e);
            throw e;
        }
    }

    if (WhitelistUtils.isInitialWhitelistedNodesAvailable()) {
        try {
            console.log("   > Validating Initial Whitelisted eNode Addresses ...");
            WhitelistUtils.getInitialWhitelistedNodes();
        } catch (e) {
            console.log("   > Invalid Initial Whitelisted eNode Address: " + e);
            throw e;
        }
    }  
};