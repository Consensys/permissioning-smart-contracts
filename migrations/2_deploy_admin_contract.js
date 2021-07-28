const AllowlistUtils = require('../scripts/allowlist_utils');

const Admin = artifacts.require("./Admin.sol");

async function logCurrentAdmins(instance) {
    let currentAdmins = await instance.getAdmins();
    console.log("\n<<< current ADMIN list >>>");
    console.log(currentAdmins);
    console.log("\n<<< end of current ADMIN list >>>");
}

module.exports = async(deployer, network) => {
    // exit early if we are NOT redeploying this contract
    let retainCurrentRulesContract = AllowlistUtils.getRetainAdminContract();
    if (retainCurrentRulesContract) {
        console.log("not deploying Admin Rules because retain=" + retainCurrentRulesContract);
        let instance = await Admin.deployed();
        logCurrentAdmins(instance);
        return;
    }
    await deployer.deploy(Admin);
    console.log("   > Admin contract deployed with address = " + Admin.address);

    let instance = await Admin.deployed();

    if(AllowlistUtils.isInitialAdminAccountsAvailable()) {
        console.log("   > Adding Initial Admin Accounts ...");
        let initialAdminAccounts = AllowlistUtils.getInitialAdminAccounts();
        if (initialAdminAccounts.length > 0) {
            let adminAddedResult = await instance.addAdmins(initialAdminAccounts);
            console.log ("   > Initial admin accounts added : " + initialAdminAccounts); 
        }
    }

    logCurrentAdmins(instance);
}
