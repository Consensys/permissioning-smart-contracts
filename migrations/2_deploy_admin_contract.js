const Web3Utils = require("web3-utils");

const Admin = artifacts.require("./Admin.sol");

module.exports = async(deployer, network) => {
    await deployer.deploy(Admin);
    console.log("   > Admin contract deployed with address = " + Admin.address);
}
