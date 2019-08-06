const WhitelistUtils = require('../scripts/whitelist_utils');

const Admin = artifacts.require("./Admin.sol");

module.exports = async(deployer, network) => {
    await deployer.deploy(Admin);
    console.log("   > Admin contract deployed with address = " + Admin.address);

    let instance = await Admin.deployed();

    if(WhitelistUtils.isInitialAdminAccountsAvailable()) {
        console.log("   > Adding Initial Admin Accounts ...");
        let initialAdminAccounts = WhitelistUtils.getInitialAdminAccounts();
        if (initialAdminAccounts.length > 0) {
            let adminAddedResult = await instance.addAdmins(initialAdminAccounts);
            console.log ("   > Initial admin accounts added : " + initialAdminAccounts); 
        }
    } 
}
