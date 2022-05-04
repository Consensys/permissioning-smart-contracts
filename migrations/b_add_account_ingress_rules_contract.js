const Web3Utils = require("web3-utils");
const AllowlistUtils = require('../scripts/allowlist_utils');

const Rules = artifacts.require("./AccountRules.sol");
const AccountIngress = artifacts.require("./AccountIngress.sol");
const Admin = artifacts.require("./Admin.sol");
const AccountStorage = artifacts.require("./AccountStorage.sol");

const adminContractName = Web3Utils.utf8ToHex("administration");
const rulesContractName = Web3Utils.utf8ToHex("rules");

/* The address of the account ingress contract if pre-deployed */
let accountIngress = process.env.ACCOUNT_INGRESS_CONTRACT_ADDRESS;
/* The address of the account storage contract if pre-deployed */
let accountStorage = process.env.ACCOUNT_STORAGE_CONTRACT_ADDRESS;
let accountRules = process.env.ACCOUNT_RULES_CONTRACT_ADDRESS;
let retainCurrentRulesContract = AllowlistUtils.getRetainAccountRulesContract();

async function logCurrentAllowlist(instance) {
    let currentAllowlist = await instance.getAccounts();
    console.log("\n<<< current ACCOUNT allowlist >>>");
    console.log(currentAllowlist);
    console.log("\n<<< end of current ACCOUNT allowlist >>>");
}

async function logCurrentTargetlist(instance) {
    let currentTargetlist = await instance.getTargets();
    console.log("\n<<< current TARGET allowlist >>>");
    console.log(currentTargetlist);
    console.log("\n<<< end of current TARGET allowlist >>>");
}

module.exports = async(deployer, network) => {
    // exit early if we are NOT redeploying this contract
    if (retainCurrentRulesContract) {
        console.log("not deploying AccountRules because retain=" + retainCurrentRulesContract);
        logCurrentAllowlist(await Rules.deployed());
        return;
    }
    if (! accountIngress) {
        // Only deploy if we haven't been provided a pre-deployed address
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

    // STORAGE
    var storageInstance;
    // is there a storage already deployed
    storageInstance = await AccountStorage.at(accountStorage);
    console.log(">>> Using existing AccountStorage " + storageInstance.address);

    console.log("   > Rules deployed with AccountIngress.address = " + accountIngress + "\n   > and storageAddress = " + accountStorage);
    let accountRulesContract = await Rules.at(accountRules);

    // storage -> rules
    await storageInstance.upgradeVersion(accountRules);
    console.log("   >>> Set storage owner to Rules.address " + accountRules);

    /* The address of the admin */
    let adminAddress = process.env.ADMIN_CONTRACT_ADDRESS;

    await accountIngressInstance.setContractAddress(adminContractName, adminAddress);
    console.log("   > Updated AccountIngress with Admin address = " + adminAddress);

    await storageInstance.addTarget("0x0000000000000000000000000000000000009999"); //node Ingress
    await storageInstance.addTarget("0x0000000000000000000000000000000000008888"); //account Ingress
    await storageInstance.addTarget("0x19a1D5210A71AB263208bC64E91C6C6349a3b3Ef"); //node Rules
    await storageInstance.addTarget(accountRules); //account Rules
    await storageInstance.addTarget(adminAddress); //admin contract
    await storageInstance.addTarget("0x7a4363E55Ef04e9144a2B187ACA804631A3155B5"); //RelayHub
    await storageInstance.addTarget("0xed629f027a35B377F0a9Fd4560167e0AA85817Cf"); //rotation validator
    
    await storageInstance.addAccount("0x971bb94d235a4ba42d53Ab6fB0A86B12C73Ba460")
    await storageInstance.addAccount("0xCB4f5bB78072D76Ec2C99DdA2FA216488F650611")
    await storageInstance.addAccount("0xf7C8844af922e15b2867680747905bd009EC918A")
    await storageInstance.addAccount("0xCC9a2ae1162D5de44E11363556c829D6c08f7dc9")

    await accountRulesContract.setRelay("0x7a4363E55Ef04e9144a2B187ACA804631A3155B5"); //Set Relay Hub

    await storageInstance.updateAccountRules(accountRules)  

    logCurrentAllowlist(accountRulesContract);
    logCurrentTargetlist(accountRulesContract);

    await accountIngressInstance.setContractAddress(rulesContractName, accountRules);
    console.log("   > Updated AccountIngress contract with Rules address = " + accountRules);

}
