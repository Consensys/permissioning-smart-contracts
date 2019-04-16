const Web3Utils = require("web3-utils");

const Rules = artifacts.require("./Rules.sol");
const Ingress = artifacts.require("./Ingress.sol");

// "rules" as bytes32
const rulesContractName = Web3Utils.utf8ToHex("rules");
// "administration" as bytes32
const adminContractName = Web3Utils.utf8ToHex("administration");

/* The address of the ingress contract if pre deployed */
let ingressAddress = process.env.INGRESS_CONTRACT_ADDRESS;

module.exports = async(deployer, network) => {
    if (! ingressAddress) {
        // Only deploy if we haven't been provided a predeployed address
        await deployer.deploy(Ingress);
        console.log("   > Deployed Ingress contract to address = " + Ingress.address);
        ingressAddress = Ingress.address;

    } 
    // If supplied an address, make sure there's something there
    const ingressInstance = await Ingress.at(ingressAddress);
    try {
        const result = await ingressInstance.getContractVersion();
        console.log("   > Ingress contract initialised at address = " + ingressAddress + " version=" + result);
    } catch (err) {
        console.log(err);
        console.error("   > Predeployed Ingress contract is not responding like an Ingress contract at address = " + ingressAddress);
    }

    await deployer.deploy(Rules, ingressAddress);
    console.log("   > Rules deployed with Ingress.address = " + ingressAddress);
    await ingressInstance.setContractAddress(rulesContractName, Rules.address);
    console.log("   > Updated Ingress contract with Rules address = " + Rules.address);
    // set Rules contract as admin contract
    await ingressInstance.setContractAddress(adminContractName, Rules.address);
    console.log("   > Updated Ingress contract with Admin address = " + Rules.address);
}