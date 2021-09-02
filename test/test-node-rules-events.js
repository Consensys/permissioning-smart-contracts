const NodeIngress = artifacts.require('NodeIngress.sol');
const NodeRules = artifacts.require('NodeRules.sol');
const RulesStorage = artifacts.require('NodeStorage.sol');
const Admin = artifacts.require('Admin.sol');

// Contract keys
const RULES_NAME = "0x72756c6573000000000000000000000000000000000000000000000000000000";
const ADMIN_NAME = "0x61646d696e697374726174696f6e000000000000000000000000000000000000";

const enode1 = "9bd359fdc3a2ed5df436c3d8914b1532740128929892092b7fcb320c1b62f375"
+ "2e1092b7fcb320c1b62f3759bd359fdc3a2ed5df436c3d8914b1532740128929";
const node1Host = "127.0.0.1";
const node1Port = 30303;

const newAdmin = "f17f52151EbEF6C7334FAD080c5704D77216b732";

contract("NodeRules (Events)", () => {
  let nodeIngressContract;
  let nodeRulesContract;
  let adminContract;

  beforeEach(async () => {
    nodeIngressContract = await NodeIngress.new();

    adminContract = await Admin.new();
    await nodeIngressContract.setContractAddress(ADMIN_NAME, adminContract.address);

    // set the storage
    storageContract = await RulesStorage.new(nodeIngressContract.address);
    console.log("   >>> Storage contract deployed with address = " + storageContract.address);
    
    nodeRulesContract = await NodeRules.new(nodeIngressContract.address, storageContract.address);
    await nodeIngressContract.setContractAddress(RULES_NAME, nodeRulesContract.address);

    // set rules as the storage owner
    await storageContract.upgradeVersion(nodeRulesContract.address);
    console.log("   >>> Set storage owner to Rules.address");
  })

  it('should emit events when node added', async () => {
    await nodeRulesContract.addEnode(enode1, node1Host, node1Port);
    await nodeRulesContract.addEnode(enode1, node1Host, node1Port);

    // Get the events
    let result = await nodeRulesContract.getPastEvents("NodeAdded", {fromBlock: 0, toBlock: "latest" });

    // Verify the successful NodeAdded event is 'true'
    assert.equal(result[0].returnValues.nodeAdded, true, "nodeAdded SHOULD be true");

    // Verify the unsuccessful dupliate NodeAdded event is 'false'
    assert.equal(result[1].returnValues.nodeAdded, false, "nodeAdded SHOULD be false");
  });

  it('should emit events when node removed', async () => {
    await nodeRulesContract.addEnode(enode1, node1Host, node1Port);
    await nodeRulesContract.removeEnode(enode1, node1Host, node1Port);
    await nodeRulesContract.removeEnode(enode1, node1Host, node1Port);

    // Get the events
    let result = await nodeRulesContract.getPastEvents("NodeRemoved", {fromBlock: 0, toBlock: "latest" });

    // Verify the successful NodeRemoved event is 'true'
    assert.equal(result[0].returnValues.nodeRemoved, true, "nodeRemoved SHOULD be true");

    // Verify the unsuccessful duplicate NodeRemoved event is 'false'
    assert.equal(result[1].returnValues.nodeRemoved, false, "nodeRemoved SHOULD be false");
  });
});
