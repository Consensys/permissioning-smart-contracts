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
    if (! accountStorage) {
        // Only deploy if we haven't been provided a pre-deployed address
        storageInstance = await deployer.deploy(AccountStorage, accountIngress);
        console.log("   > Deployed AccountStorage contract to address = " + AccountStorage.address);
        accountStorage = AccountStorage.address;
    } else {
        // is there a storage already deployed
        storageInstance = await AccountStorage.at(accountStorage);
        console.log(">>> Using existing AccountStorage " + storageInstance.address);
        // TODO check that this contract is a storage contract eg call a method
    }

    // rules -> storage
    await deployer.deploy(Rules, accountIngress, accountStorage);
    console.log("   > Rules deployed with AccountIngress.address = " + accountIngress + "\n   > and storageAddress = " + accountStorage);
    console.log("   > Rules.address " + Rules.address);
}
