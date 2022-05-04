const Web3Utils = require("web3-utils");
const AllowlistUtils = require('../scripts/allowlist_utils');

const Rules = artifacts.require("./NodeRules.sol");
const NodeIngress = artifacts.require("./NodeIngress.sol");
const NodeStorage = artifacts.require("./NodeStorage.sol");
const Admin = artifacts.require("./Admin.sol");

const adminContractName = Web3Utils.utf8ToHex("administration");
const rulesContractName = Web3Utils.utf8ToHex("rules");

/* The address of the node ingress contract if pre deployed */
let nodeIngress = process.env.NODE_INGRESS_CONTRACT_ADDRESS;
/* The address of the node storage contract if pre deployed */
let nodeStorage = process.env.NODE_STORAGE_CONTRACT_ADDRESS;
let nodeRules = process.env.NODE_RULES_CONTRACT_ADDRESS;
let retainCurrentRulesContract = AllowlistUtils.getRetainNodeRulesContract();

async function logCurrentAllowlist(instance) {
    let s = await instance.getSize();
    console.log("\n<<< current NODE allowlist >>>");
    for (i = 0; i < s; i ++) {
        let x = await instance.getByIndex(i);
        console.log("enode://" + x[0] + "@" + x[1] + ":" + x[2]);
    }
    console.log("<<< end of current NODE list >>>");
}

module.exports = async(deployer, network) => {
    // exit early if we are NOT redeploying this contract
    if (retainCurrentRulesContract) {
        console.log("not deploying NodeRules because retain=" + retainCurrentRulesContract);
        logCurrentAllowlist(await Rules.deployed());
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

    // STORAGE
    var storageInstance;
    // is there a storage already deployed
    storageInstance = await NodeStorage.at(nodeStorage);
    console.log(">>> Using existing NodeStorage " + storageInstance.address);

    // RULES
    console.log("   > Rules deployed with NodeIngress.address = " + nodeIngress + "\n   > and storageAddress = " + nodeStorage);
    console.log("   > Rules.address " + nodeRules);
    let nodeRulesContract = await Rules.at(nodeRules);
    
/*    if(AllowlistUtils.isInitialAllowlistedNodesAvailable()) {
        console.log("   > Adding Initial Allowlisted eNodes ...");
        let allowlistedNodes = AllowlistUtils.getInitialAllowlistedNodes();
        for (i = 0; i < allowlistedNodes.length; i++) {
            let enode = allowlistedNodes[i];
            const { enodeId, host, port } = AllowlistUtils.enodeToParams(enode);
            
            let result = await nodeRulesContract.addEnode(
                enodeId,
                host,    
                Web3Utils.toBN(port)
            );
            console.log("     > eNode added: " + enode );
        }
    }*/

    await storageInstance.addConnectionAllowed("0x5B950E77941D01CDF246D00B1ECE546BC95234B77D98B44C9187E2733AFA696A","0x5B950E77941D01CDF246D00B1ECE546BC95234B77D98B44C9187E2733AFA696A");
    await storageInstance.addConnectionAllowed("0xDAE96FC0046A5AE1864D9A66E6715DA8DA08240E7119816AB722261C0744D8E8","0xDAE96FC0046A5AE1864D9A66E6715DA8DA08240E7119816AB722261C0744D8E8");
    await storageInstance.addConnectionAllowed("0x4BB48E76F19DE6EBED7D59D46800508030AECEA46BA56BD19855D94473E28BC0","0x5B950E77941D01CDF246D00B1ECE546BC95234B77D98B44C9187E2733AFA696A");
    await storageInstance.addConnectionAllowed("0xDAE96FC0046A5AE1864D9A66E6715DA8DA08240E7119816AB722261C0744D8E8","0x5B950E77941D01CDF246D00B1ECE546BC95234B77D98B44C9187E2733AFA696A");

    await storageInstance.add(
        "0xed664ba8ec6959b1b2bd70dce16286cb1688f2f8ab13b8571b0ba4eeb73df9d5",
        "0xf5acb32efff7aabd71fc865d374d2e9c96c524ca543c9aa65dd6543f83852521",
        "0x00000000000000000000ffff23e53e97",    
        60606,
        1,
        "0x00646a6e3431",
        "IDB_VAL_1",
        "IDB",
        "NA",
        "0xDAE96FC0046A5AE1864D9A66E6715DA8DA08240E7119816AB722261C0744D8E8"
    );

    await storageInstance.add(
        "0xb10272c5206cd1ec12c6737a41df471e6384cde3e6522a212e3839be09981133",
        "0xeccdacc4ef1c7aacd3aeb63debfa82643d92820bb9f045245cb6badb74dff198",
        "0x00000000000000000000ffff228a06bb",    
        60606,
        0,
        "0x00646a6e3431",
        "IDB_BOOT_1",
        "IDB",
        "NA",
        "0x5B950E77941D01CDF246D00B1ECE546BC95234B77D98B44C9187E2733AFA696A"
    );
            
   await storageInstance.add(
        "0x9b182d9ccdda04b93fecc9a82ebb3c07e1179d8976b4ed1df4790d371fcf03c0",
        "0xf5081f3fc66532810d9458a5aae13a9c6619916098d89eee3cd6bfd755fc028c",
        "0x00000000000000000000ffff2249e4c8",    
        60606,
        2,
        "0x00646a6e3431",
        "IDB_WRI_1",
        "IDB",
        "NA",
        "0x4BB48E76F19DE6EBED7D59D46800508030AECEA46BA56BD19855D94473E28BC0"
    );
    
    await storageInstance.add(
        "0x92e2eadcf4720cc7f4c14424cb6af160452606a85278ef4e3d780cfd1cfe475a",
        "0x88db78d8f0cab50552f289ebfbfcdbc33a30b066c098042a1d704cc3133ff6a7",
        "0x00000000000000000000ffffa5621026",    
        60606,
        1,
        "0x00646a6e3431",
        "Red_Clara_VAL_3",
        "Red Clara",
        "NA",
        "0xDAE96FC0046A5AE1864D9A66E6715DA8DA08240E7119816AB722261C0744D8E8"
    );

    await storageInstance.add(
        "0x819581f145d76c6be9d663053651a095b520a1d5d41fe92084e76f95da076de8",
        "0xd90ddfc9624f776188aeba0ed46e42670fddd95a934d839ccb7c1ba0019ab9a0",
        "0x00000000000000000000ffffa5621027",    
        60606,
        1,
        "0x00646a6e3431",
        "Red_Clara_VAL_4",
        "Red Clara",
        "NA",
        "0xDAE96FC0046A5AE1864D9A66E6715DA8DA08240E7119816AB722261C0744D8E8"
    );

    await storageInstance.add(
        "0xedb433099bbdbf483987ff7d69978bdbef10b120b89597fbc352292050f48985",
        "0x2b98f43847ad8550ddd2a58396180a078a68af9801a91663c23b77e769c0e794",
        "0x00000000000000000000ffff176012ff",    
        60606,
        1,
        "0x00646a6e3431",
        "extrimian_val_1",
        "Extrimian",
        "NA",
        "0xDAE96FC0046A5AE1864D9A66E6715DA8DA08240E7119816AB722261C0744D8E8"
    );

    await storageInstance.add(
        "0x7bfb33a203ca3fc5e2aecdf40c37831157a43d6832ae640f5147f024d296ab6a",
        "0x0b54abef158c648423f53cf0af00918dafc40042ece6273835de227ab8d600ab",
        "0x00000000000000000000ffff146a9915",    
        60606,
        1,
        "0x00646a6e3431",
        "exrimian_val_2",
        "Extrimian",
        "NA",
        "0xDAE96FC0046A5AE1864D9A66E6715DA8DA08240E7119816AB722261C0744D8E8"
    );

    await storageInstance.add(
        "0xe88b976ae0c5f601eadd3d918f126837b7b90dd77ca4feddb4be3af2215dc9e8",
        "0xa5aff723653c62185de45f320c3dbe54c84521ebb7d1f2a50038a526d52ebb41",
        "0x00000000000000000000ffff146a992c",    
        60606,
        1,
        "0x00646a6e3431",
        "extrimian_val_3",
        "Extrimian",
        "NA",
        "0xDAE96FC0046A5AE1864D9A66E6715DA8DA08240E7119816AB722261C0744D8E8"
    );

    await storageInstance.add(
        "0xec0e97c7a728b9c4d4ca7a26b46a791d552774f52a65ff4cc11b627e5aa0f141",
        "0x62b9ab104f4bcfb3f0bbaa9ccbb30ff1104249643ba497999aabf202730b78a5",
        "0x00000000000000000000ffff34048d88",    
        60606,
        2,
        "0x00646a6e3431",
        "metrika_writer",
        "Metrika",
        "NA",
        "0x4BB48E76F19DE6EBED7D59D46800508030AECEA46BA56BD19855D94473E28BC0"
    );

    await storageInstance.add(
        "0x76147831720d9a3d61e6cf31d03e38eba7bd46832c0691e9c1dd219c674acf73",
        "0x8f1a00b9fea871f63d546686954a8ea6726fdbbe7a840d74ab2f774e501e6fa3",
        "0x00000000000000000000ffffb3001655",    
        60606,
        1,
        "0x00646a6e3431",
        "RedCLARA_CR_VAL_1",
        "Red Clara",
        "NA",
        "0xDAE96FC0046A5AE1864D9A66E6715DA8DA08240E7119816AB722261C0744D8E8"
    );

    await storageInstance.add(
        "0x50053bb4de26e2c0ea733e450c3d4919579e7e131adcc6eeb80f006022148c10",
        "0x543c219a9262689aa1cc45d72c472ab7e0a0d056d398ba297fa3402ce1239930",
        "0x00000000000000000000ffffb3001656",    
        60606,
        1,
        "0x00646a6e3431",
        "RedCLARA_CR_VAL_2",
        "Red Clara",
        "NA",
        "0xDAE96FC0046A5AE1864D9A66E6715DA8DA08240E7119816AB722261C0744D8E8"
    );    

    await storageInstance.add(
        "0xac1f7c028bd95c1c35d56fe8490b376c00bb90ac89c77a9ff8da0d3bfb06e100",
        "0x352e63bec71cf4c1ab6ed38173ba233434f35c91a2c83e090023e22dbbd18ca4",
        "0x00000000000000000000ffff42afd87a",    
        60606,
        1,
        "0x00646a6e3431",
        "RedLacnic_VAL_1",
        "Red LACNIC",
        "NA",
        "0xDAE96FC0046A5AE1864D9A66E6715DA8DA08240E7119816AB722261C0744D8E8"
    );  

    await storageInstance.add(
        "0x4d16f4d9c0b08528eeabb13d550abd6ddada5b377941e2f52a4fad6c1570efc6",
        "0xba773f36038176f1289f608c1f9795a4a380f7192d5e220c3e1179da6e5b0116",
        "0x00000000000000000000ffffb03a7a0c",    
        60606,
        1,
        "0x00646a6e3431",
        "RedLacnic_VAL_2",
        "Red LACNIC",
        "NA",
        "0xDAE96FC0046A5AE1864D9A66E6715DA8DA08240E7119816AB722261C0744D8E8"
    ); 

    await storageInstance.add(
        "0x2009e77345598adba64bf82648ee5c3a14cace2b971b8d4b5cc1c78044226900",
        "0x1759a4a7563cfdf15d63a9f67bb012b656490ace094778721f7c6fd563dfa475",
        "0x00000000000000000000ffffa879b819",    
        60606,
        1,
        "0x00646a6e3431",
        "RedLacnic_VAL_3",
        "Red LACNIC",
        "NA",
        "0xDAE96FC0046A5AE1864D9A66E6715DA8DA08240E7119816AB722261C0744D8E8"
    );

    await storageInstance.add(
        "0xb33dedabc36b236a78383f5baba14575d9260132eb098df425b8516d2186398a",
        "0xad7ce00ba0912089556d3ded35fb2b2b26e61aeaf0b9b7e7daf9427775489300",
        "0x00000000000000000000ffffc8030eb0",    
        60606,
        1,
        "0x00646a6e3431",
        "RedLacnic_VAL_4",
        "Red LACNIC",
        "NA",
        "0xDAE96FC0046A5AE1864D9A66E6715DA8DA08240E7119816AB722261C0744D8E8"
    );

    await storageInstance.add(
        "0xef974e9b43b28bbcbb444c1887620cfea8f6e0f49605006b765b6f772ba00eeb",
        "0xae58de9e4b925be082cd72e87db4846d64438d9b3c1947f6a391c00f1952763a",
        "0x00000000000000000000ffff3495d53e",    
        60606,
        2,
        "0x00646a6e3431",
        "extrimian_wri_1",
        "Extrimian",
        "NA",
        "0x4BB48E76F19DE6EBED7D59D46800508030AECEA46BA56BD19855D94473E28BC0"
    );

    await storageInstance.add(
        "0xed764e22cd77bbf597d450bcb1378ff2164ee7b4a47a386e3c3cf1c4d60c8898",
        "0xd20d8c861652d2d4c595997d0a0a36d4a10e69ea449d15e1cb31ea3f48cb092f",
        "0x00000000000000000000ffff8a3b0d07",    
        60606,
        0,
        "0x00646a6e3431",
        "RedCLARA_US_BOOT_1",
        "Red Clara",
        "NA",
        "0x5B950E77941D01CDF246D00B1ECE546BC95234B77D98B44C9187E2733AFA696A"
    );

    await storageInstance.add(
        "0xa2576e375981ff4a0b73b1490068a9d4bc712cc9f6181b7a653f37a442835fbc",
        "0x61661b9757fb3d9778837c321b890dab32e9e8a44f7b3700f8df37707ad8303c",
        "0x00000000000000000000ffffc99fdc13",    
        60606,
        1,
        "0x00646a6e3431",
        "Cedia_VAL_1",
        "Cedia",
        "NA",
        "0xDAE96FC0046A5AE1864D9A66E6715DA8DA08240E7119816AB722261C0744D8E8"
    );

    let sizeNodesStorage = await storageInstance.size()    

    console.log("Size enodes" + sizeNodesStorage)

    await storageInstance.updateNodeRules(nodeRules)  
    
    console.log("Set NodeRules a Storage - VALIDAR")

    let sizeNodesRules = await nodeRulesContract.getSize()

    console.log("Size nodes from rules:" + sizeNodesRules)

    let connectionAllowed = await nodeRulesContract.connectionAllowed(
        "0xed664ba8ec6959b1b2bd70dce16286cb1688f2f8ab13b8571b0ba4eeb73df9d5",
        "0xf5acb32efff7aabd71fc865d374d2e9c96c524ca543c9aa65dd6543f83852521",
        "0x00000000000000000000ffff23e53e97",    
        60606,
        "0xedb433099bbdbf483987ff7d69978bdbef10b120b89597fbc352292050f48985",
        "0x2b98f43847ad8550ddd2a58396180a078a68af9801a91663c23b77e769c0e794",
        "0x00000000000000000000ffff176012ff",    
        60606
    )

    console.log("Connection allowed:" + connectionAllowed)

    logCurrentAllowlist(nodeRulesContract);

    /* The address of the admin */
    let adminAddress = process.env.ADMIN_CONTRACT_ADDRESS;

    await nodeIngressInstance.setContractAddress(adminContractName, adminAddress);
    console.log("   > Updated NodeIngress with Admin  address = " + adminAddress);

    await nodeIngressInstance.setContractAddress(rulesContractName, nodeRules);
    console.log("   > Updated NodeIngress contract with NodeRules address = " + nodeRules);

}
