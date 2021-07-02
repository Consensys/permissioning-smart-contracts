const Web3Utils = require("web3-utils");
const AllowlistUtils = require('../scripts/allowlist_utils');

const Rules = artifacts.require("./AccountRules.sol");
const AccountIngress = artifacts.require("./AccountIngress.sol");
const Admin = artifacts.require("./Admin.sol");
const AccountRulesListEternalStorage = artifacts.require("./AccountRulesListEternalStorage.sol");

const adminContractName = Web3Utils.utf8ToHex("administration");
const rulesContractName = Web3Utils.utf8ToHex("rules");

/* The address of the account ingress contract if pre deployed */
let accountIngress = process.env.ACCOUNT_INGRESS_CONTRACT_ADDRESS;
let retainCurrentRulesContract = AllowlistUtils.getRetainAccountRulesContract();

module.exports = async(deployer, network) => {
    // exit early if we are NOT redeploying this contract
    if (retainCurrentRulesContract) {
        console.log("not deploying AccountRules because retain=" + retainCurrentRulesContract);
        return;
    }
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

    // STORAGE
    var storageInstance;
    let forceStorageReset = true;
    if (forceStorageReset) {
        storageInstance = await deployer.deploy(AccountRulesListEternalStorage, accountIngress);
        console.log(">>> Forced storage reset. NEW STORAGE " + storageInstance.address);
    } else {
        // is there a storage already deployed
        storageInstance = await AccountRulesListEternalStorage.deployed();
        console.log("trying to get deployed()");
        console.log(">>> Using existing storage " + storageInstance.address);
        if (storageInstance.address == 0) {
            storageInstance = await deployer.deploy(AccountRulesListEternalStorage, accountIngress);
        }
        console.log(">>> Using existing storage " + storageInstance.address);
    }
    let storageAddress = storageInstance.address;

    // rules -> storage
    await deployer.deploy(Rules, accountIngress, storageAddress);
    console.log("   > Rules deployed with AccountIngress.address = " + accountIngress + "\n   > and storageAddress = " + storageAddress);
    let accountRulesContract = await Rules.deployed();

    // storage -> rules
    await storageInstance.upgradeVersion(Rules.address);
    console.log("   >>> Set storage owner to Rules.address " + Rules.address);

    if (AllowlistUtils.isInitialAllowlistedAccountsAvailable()) {
        console.log("   > Adding Initial Allowlisted Accounts ...");
        let allowlistedAccounts = AllowlistUtils.getInitialAllowlistedAccounts();
        if (allowlistedAccounts.length > 0) {
            await accountRulesContract.addAccounts(allowlistedAccounts);
            console.log ("   > Initial Allowlisted Accounts added: " + allowlistedAccounts);
        }
    }

    await accountIngressInstance.setContractAddress(rulesContractName, Rules.address);
    console.log("   > Updated AccountIngress contract with Rules address = " + Rules.address);
}
