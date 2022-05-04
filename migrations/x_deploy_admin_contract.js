const AllowlistUtils = require('../scripts/allowlist_utils');

const Admin = artifacts.require("./Admin.sol");

async function logCurrentAdmins(instance) {
    let currentAdmins = await instance.getOwners();
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

    let nodeIngress = process.env.NODE_INGRESS_CONTRACT_ADDRESS;

    let adminList = ["0xCC9a2ae1162D5de44E11363556c829D6c08f7dc9","0xCB4f5bB78072D76Ec2C99DdA2FA216488F650611","0xf7C8844af922e15b2867680747905bd009EC918A"]
    await deployer.deploy(Admin,adminList,2,nodeIngress);
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

    let isAuthorized = await instance.isAuthorized("0xCC9a2ae1162D5de44E11363556c829D6c08f7dc9")
    console.log("Esta autorizado:"+ isAuthorized)
    
    logCurrentAdmins(instance);
}
