const Web3Utils = require("web3-utils");
const AllowlistUtils = require('../scripts/allowlist_utils');

const Rules = artifacts.require("./NodeRules.sol");
const NodeIngress = artifacts.require("./NodeIngress.sol");
const NodeRulesListEternalStorage = artifacts.require("./NodeRulesListEternalStorage.sol");
const Admin = artifacts.require("./Admin.sol");

const adminContractName = Web3Utils.utf8ToHex("administration");
const rulesContractName = Web3Utils.utf8ToHex("rules");

/* The address of the node ingress contract if pre deployed */
let nodeIngress = process.env.NODE_INGRESS_CONTRACT_ADDRESS;
/* The address of the node ingress contract if pre deployed */
let nodeStorage = process.env.NODE_STORAGE_CONTRACT_ADDRESS;
let retainCurrentRulesContract = AllowlistUtils.getRetainNodeRulesContract();

module.exports = async(deployer, network) => {
    // exit early if we are NOT redeploying this contract
    if (retainCurrentRulesContract) {
        console.log("not deploying NodeRules because retain=" + retainCurrentRulesContract);
        return;
    }
    if (! nodeIngress) {
        // Only deploy if we haven't been provided a predeployed address
        await deployer.deploy(NodeIngress);
        console.log("   > Deployed NodeIngress contract to address = " + NodeIngress.address);
        nodeIngress = NodeIngress.address;

    }
    // If supplied an address, make sure there's something there
    const nodeIngressInstance = await NodeIngress.at(nodeIngress);
    try {
        const result = await nodeIngressInstance.getContractVersion();
        console.log("   > NodeIngress contract initialised at address = " + nodeIngress + " version=" + result);
    } catch (err) {
        console.log(err);
        console.error("   > Predeployed NodeIngress contract is not responding like an NodeIngress contract at address = " + nodeIngress);
    }

    const admin = await Admin.deployed()
    await nodeIngressInstance.setContractAddress(adminContractName, admin.address);
    console.log("   > Updated NodeIngress with Admin  address = " + admin.address);

    // STORAGE
    var storageInstance;
    if (! nodeStorage) {
        // Only deploy if we haven't been provided a pre-deployed address
        storageInstance = await deployer.deploy(NodeRulesListEternalStorage, nodeIngress);
        console.log("   > Deployed NodeStorage contract to address = " + NodeRulesListEternalStorage.address);
        nodeStorage = NodeRulesListEternalStorage.address;
    } else {
        // is there a storage already deployed
        storageInstance = await NodeRulesListEternalStorage.at(nodeStorage);
        console.log(">>> Using existing NodeStorage " + storageInstance.address);
        // TODO check that this contract is a storage contract eg call a method
    }

    // rules -> storage
    await deployer.deploy(Rules, nodeIngress, nodeStorage);
    console.log("   > Rules deployed with NodeIngress.address = " + nodeIngress + "\n   > and storageAddress = " + nodeStorage);
    console.log("   > Rules.address " + Rules.address);
    let nodeRulesContract = await Rules.deployed();
    

    await nodeIngressInstance.setContractAddress(rulesContractName, Rules.address);
    console.log("   > Updated NodeIngress contract with NodeRules address = " + Rules.address);

    if(AllowlistUtils.isInitialAllowlistedNodesAvailable()) {
        console.log("   > Adding Initial Allowlisted eNodes ...");
        let allowlistedNodes = AllowlistUtils.getInitialAllowlistedNodes();
        for (i = 0; i < allowlistedNodes.length; i++) {
            let enode = allowlistedNodes[i];
            const { enodeId, ip, port } = AllowlistUtils.enodeToParams(enode);
            
            let result = await nodeRulesContract.addEnode(
                enodeId,
                ip,    
                Web3Utils.toBN(port)
            );
            console.log("     > eNode added: " + enode );
        }
    }
}
