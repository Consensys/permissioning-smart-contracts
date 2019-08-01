const Web3Utils = require("web3-utils");

const Admin = artifacts.require("./Admin.sol");

/* Optional initial Admin Accounts */
let initialAdminAccounts = process.env.INITIAL_ADMIN_ACCOUNTS;

module.exports = async(deployer, network) => {

    await deployer.deploy(Admin);
    console.log("   > Admin contract deployed with address = " + Admin.address);

    let instance = await Admin.deployed();

    //add additional admin accounts
    if (initialAdminAccounts) {
        let initialAdminAccountsPrefixed = initialAdminAccounts.split(/,/).map(
            function(acc) {
                let trimmedAcc = acc.trim();
                if (!trimmedAcc.startsWith("0x")) {
                    trimmedAcc = "0x" + trimmedAcc;
                }
                return trimmedAcc;
            }
        );
        if (initialAdminAccountsPrefixed && initialAdminAccountsPrefixed.length > 0) {
            let adminAddedResult = await instance.addAdmins(initialAdminAccountsPrefixed);
            console.log ("   > Admin Contract - Added initial admin accounts : " + initialAdminAccountsPrefixed.toString());
        }    
    }   
}
