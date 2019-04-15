const Web3Utils = require("web3-utils");

const Rules = artifacts.require("./Rules.sol");
const Ingress = artifacts.require("./Ingress.sol");

// "rules" as bytes32
const rulesContractName = Web3Utils.utf8ToHex("rules");

module.exports = async(deployer, network) => {
    await deployer.deploy(Rules, Ingress.address);
    const ingressInstance = await Ingress.deployed();
    await ingressInstance.setContractAddress(rulesContractName, Rules.address);
    console.log("   > Updated Ingress contract with Rules address = " + Rules.address);
}