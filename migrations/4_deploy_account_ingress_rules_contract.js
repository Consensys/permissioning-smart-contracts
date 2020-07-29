const Web3Utils = require("web3-utils");
const AllowlistUtils = require('../scripts/allowlist_utils');

const Rules = artifacts.require("./AccountRules.sol");
const AccountIngress = artifacts.require("./AccountIngress.sol");
const Admin = artifacts.require("./Admin.sol");

const adminContractName = Web3Utils.utf8ToHex("administration");
const rulesContractName = Web3Utils.utf8ToHex("rules");

/* The address of the account ingress contract if pre deployed */
let accountIngress = process.env.ACCOUNT_INGRESS_CONTRACT_ADDRESS;

module.exports = async(deployer, network) => {
    if (! accountIngress) {
        // Only deploy if we haven't been provided a predeployed address
        await deployer.deploy(AccountIngress);
        console.log("   > Deployed AccountIngress contract to address = " + AccountIngress.address);
        accountIngress = AccountIngress.address;

    }
    // If supplied an address, make sure there's something there
    const accountIngressInstance = await AccountIngress.at(accountIngress);
    try {
        const result = await accountIngressInstance.getContractVersion();
        console.log("   > AccountIngress contract initialised at address = " + accountIngress + " version=" + result);
    } catch (err) {
        console.log(err);
        console.error("   > Predeployed AccountIngress contract is not responding like an AccountIngress contract at address = " + accountIngress);
    }

    const admin = await Admin.deployed();
    await accountIngressInstance.setContractAddress(adminContractName, admin.address);
    console.log("   > Updated AccountIngress with Admin address = " + admin.address);

    await deployer.deploy(Rules, accountIngress);
    console.log("   > Rules deployed with AccountIngress.address = " + accountIngress);
    let accountRulesContract = await Rules.deployed();

    if (AllowlistUtils.isInitialAllowlistedAccountsAvailable()) {
        console.log("   > Adding Initial Allowlisted Accounts ...");
        let allowlistedAccounts = AllowlistUtils.getInitialAllowlistedAccounts();
        if (allowlistedAccounts.length > 0) {
            let accountsAddedResult = await accountRulesContract.addAccounts(allowlistedAccounts);
            console.log ("   > Initial Allowlisted Accounts added: " + allowlistedAccounts);
        }
    }

    await accountIngressInstance.setContractAddress(rulesContractName, Rules.address);
    console.log("   > Updated AccountIngress contract with Rules address = " + Rules.address);
}
