const Web3Utils = require("web3-utils");

const Rules = artifacts.require("./Rules.sol");
const NodeIngress = artifacts.require("./NodeIngress.sol");
const Admin = artifacts.require("./Admin.sol");

const adminContractName = Web3Utils.utf8ToHex("administration");
const rulesContractName = Web3Utils.utf8ToHex("rules");

/* The address of the node ingress contract if pre deployed */
let nodeIngress = process.env.NODE_INGRESS_CONTRACT_ADDRESS;

module.exports = async(deployer, network) => {
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

    await deployer.deploy(Admin);
    console.log("   > Admin contract deployed");
    await nodeIngressInstance.setContractAddress(adminContractName, Admin.address);
    console.log("   > Updated NodeIngress with Admin  address = " + Admin.address);

    await deployer.deploy(Rules, nodeIngress);
    console.log("   > Rules deployed with NodeIngress.address = " + nodeIngress);
    await nodeIngressInstance.setContractAddress(rulesContractName, Rules.address);
    console.log("   > Updated NodeIngress contract with Rules address = " + Rules.address);
}