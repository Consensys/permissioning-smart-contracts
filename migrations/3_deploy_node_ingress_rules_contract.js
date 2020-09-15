const Web3Utils = require("web3-utils");
const AllowlistUtils = require('../scripts/allowlist_utils');

const NodeRules = artifacts.require("./NodeRules.sol");
const NodeIngress = artifacts.require("./NodeIngress.sol");
const Admin = artifacts.require("./Admin.sol");

const adminContractName = Web3Utils.utf8ToHex("administration");
const rulesContractName = Web3Utils.utf8ToHex("rules");

/* The address of the node ingress contract if pre deployed */
let nodeIngress = process.env.NODE_INGRESS_CONTRACT_ADDRESS;
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

    await deployer.deploy(NodeRules, nodeIngress);
    console.log("   > NodeRules deployed with NodeIngress.address = " + nodeIngress);
    let nodeRulesContract = await NodeRules.deployed();

    

    await nodeIngressInstance.setContractAddress(rulesContractName, NodeRules.address);
    console.log("   > Updated NodeIngress contract with NodeRules address = " + NodeRules.address);

    if(AllowlistUtils.isInitialAllowlistedNodesAvailable()) {
        console.log("   > Adding Initial Allowlisted eNodes ...");
        let allowlistedNodes = AllowlistUtils.getInitialAllowlistedNodes();
        for (i = 0; i < allowlistedNodes.length; i++) {
            let enode = allowlistedNodes[i];
            const { enodeHigh, enodeLow, ip, port } = AllowlistUtils.enodeToParams(enode);
            
            let result = await nodeRulesContract.addEnode(
                Web3Utils.hexToBytes(enodeHigh),
                Web3Utils.hexToBytes(enodeLow),
                Web3Utils.hexToBytes(ip),    
                Web3Utils.toBN(port)
            );
            console.log("     > eNode added: " + enode );
        }
    }
}
