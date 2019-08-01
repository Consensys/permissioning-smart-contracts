const Web3Utils = require("web3-utils");

const NodeRules = artifacts.require("./NodeRules.sol");
const NodeIngress = artifacts.require("./NodeIngress.sol");
const Admin = artifacts.require("./Admin.sol");

const adminContractName = Web3Utils.utf8ToHex("administration");
const rulesContractName = Web3Utils.utf8ToHex("rules");

/* The address of the node ingress contract if pre deployed */
let nodeIngress = process.env.NODE_INGRESS_CONTRACT_ADDRESS;

/* Optional initial Whitelisted Nodes */
let initialWhitelistedNodes = process.env.INITIAL_WHITELISTED_NODES;

const enodeToParams = enodeURL => {
    let enodeHigh = "";
    let enodeLow = "";
    let ip = "";
    let port = "";

    const splitURL = enodeURL.split("//")[1];
    if (splitURL) {
        const [enodeId, rawIpAndPort] = splitURL.split("@");
        if (enodeId && enodeId.length === 128) {
            enodeHigh = "0x" + enodeId.slice(0, 64);
            enodeLow = "0x" + enodeId.slice(64);
        }
        if (rawIpAndPort) {
            const [ipAndPort] = rawIpAndPort.split("?");
            if (ipAndPort) {
                [ip, port] = ipAndPort.split(":");
            }
        }
    }
    return {
        enodeHigh,
        enodeLow,
        ip: ip ? getHexIpv4(ip) : "",
        port
    };
};

const isValidEnode = str => {
    return !Object.values(enodeToParams(str)).some(value => !value);
};



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

    const admin = await Admin.deployed()
    await nodeIngressInstance.setContractAddress(adminContractName, admin.address);
    console.log("   > Updated NodeIngress with Admin  address = " + admin.address);

    await deployer.deploy(NodeRules, nodeIngress);
    console.log("   > NodeRules deployed with NodeIngress.address = " + nodeIngress);
    let nodeRulesContract = await NodeRules.deployed();

    

    await nodeIngressInstance.setContractAddress(rulesContractName, NodeRules.address);
    console.log("   > Updated NodeIngress contract with NodeRules address = " + NodeRules.address);

    //add additional whitelisted nodes
    if (initialWhitelistedNodes) {
        let initialWhitelistedNodesList = initialWhitelistedNodes.split(/,/).map(n => n.trim());

        //Convert to enode structure
        if(initialWhitelistedNodesList && initialWhitelistedNodesList.length > 0) {
            for (i=0; i < initialWhitelistedNodesList.length; i++) {
                let enode = initialWhitelistedNodesList[i];
                if (!isValidEnode(enode)) {
                    console.log("   > NodeRules Contract - Bypassing invalid ENode URL: " + enode);
                    continue;
                }
                const { enodeHigh, enodeLow, ip, port } = enodeToParams(enode);

                let result = await nodeRulesContract.addEnode(
                    Web3Utils.hexToBytes(enodeHigh),
                    Web3Utils.hexToBytes(enodeLow),
                    Web3Utils.hexToBytes(ip),    
                    Web3Utils.toBN(port)
                );
                console.log("   > NodeRules Contract - Node Added: " + enode );
            }
        }  
    } 
}

function getHexIpv4(stringIp) {
    const splitIp = stringIp.split(".");
    return `0x00000000000000000000ffff${toHex(splitIp[0])}${toHex(
        splitIp[1]
    )}${toHex(splitIp[2])}${toHex(splitIp[3])}`;
}

function toHex(number) {
    const num = Number(number).toString(16);
    return num.length < 2 ? `0${num}` : num;
}
