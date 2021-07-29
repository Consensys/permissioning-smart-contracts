const NodeIngressContract = artifacts.require('NodeIngress.sol');
const NodeRules = artifacts.require('NodeRules.sol');
const RulesStorage = artifacts.require('NodeStorage.sol');
const AdminContract = artifacts.require('Admin.sol');

// Contract keys
const RULES_NAME = "0x72756c6573000000000000000000000000000000000000000000000000000000";
const ADMIN_NAME = "0x61646d696e697374726174696f6e000000000000000000000000000000000000";

const enode1 = "9bd359fdc3a2ed5df436c3d8914b1532740128929892092b7fcb320c1b62f375"
+ "2e1092b7fcb320c1b62f3759bd359fdc3a2ed5df436c3d8914b1532740128929";
const node1Host = "127.0.0.1";
const node1Port = 30303;

const enode2 = "892092b7fcb320c1b62f3759bd359fdc3a2ed5df436c3d8914b1532740128929"
+ "cb320c1b62f37892092b7f59bd359fdc3a2ed5df436c3d8914b1532740128929";
const node2Host = "139.86.1.2";
const node2Port = 30304;

const enode3 = "765092b7fcb320c1b62f3759bd359fdc3a2ed5df436c3d8914b1532740128929"
+ "920982b7fcb320c1b62f3759bd359fdc3a2ed5df436c3d8914b1532740128929";
const node3Host = "localhost";
const node3Port = 30305;

const newAdmin = "f17f52151EbEF6C7334FAD080c5704D77216b732";

contract("NodeRules (Permissioning)", (accounts) => {
  let nodeIngressContract;
  let nodeRulesContract;
  let adminContract;
  let storageContract;

  before(async () => {
    nodeIngressContract = await NodeIngressContract.new();

    adminContract = await AdminContract.new();
    await nodeIngressContract.setContractAddress(ADMIN_NAME, adminContract.address);

    // set the storage
    storageContract = await RulesStorage.new(nodeIngressContract.address);
    console.log("   >>> Storage contract deployed with address = " + storageContract.address);
    
    nodeRulesContract = await NodeRules.new(nodeIngressContract.address, storageContract.address);
    await nodeIngressContract.setContractAddress(RULES_NAME, nodeRulesContract.address);

    // set rules as the storage owner
    await storageContract.upgradeVersion(nodeRulesContract.address);
    console.log("   >>> Set storage owner to Rules.address");
  });

  it('should NOT permit node when list is empty', async () => {
    let size = await nodeRulesContract.getSize();
    assert.equal(size, 0, "expected empty list");

    let permitted = await nodeRulesContract.enodePermitted(enode1, node1Host, node1Port);
    assert.notOk(permitted, 'expected node NOT permitted');
  });

  it('Should NOT fail when removing enode from empty list', async () => {
    let size = await nodeRulesContract.getSize();
    assert.equal(size, 0, "expected empty list");

    let tx = await nodeRulesContract.removeEnode(enode1, node1Host, node1Port);
    assert.ok(tx.receipt.status);
  });

  it('should add multiple nodes to list', async () => {
    await nodeRulesContract.addEnode(enode1, node1Host, node1Port);
    await nodeRulesContract.addEnode(enode2, node2Host, node2Port);
    await nodeRulesContract.addEnode(enode3, node3Host, node3Port);

    permitted = await nodeRulesContract.enodePermitted(enode1, node1Host, node1Port);
    assert.ok(permitted, 'expected node 1 added to be in list');

    permitted = await nodeRulesContract.enodePermitted(enode2, node2Host, node2Port);
    assert.ok(permitted, 'expected node 2 added to be in list');

    permitted = await nodeRulesContract.enodePermitted(enode3, node3Host, node3Port);
    assert.ok(permitted, 'expected node 3 added to be in list');
  });

  it('should allow a connection between nodes added to the list', async () => {
    let permitted = await nodeRulesContract.connectionAllowed(enode1, node1Host, node1Port);
    assert.equal(permitted, true, 'expected permitted node1');

    permitted = await nodeRulesContract.connectionAllowed(enode2, node2Host, node2Port);
    assert.equal(permitted, true, 'expected permitted node2');

    permitted = await nodeRulesContract.connectionAllowed(enode3, node3Host, node3Port);
    assert.equal(permitted, true, 'expected permitted node3');
  });

  it('should NOT allow connection with node removed from list', async () => {
    await nodeRulesContract.removeEnode(enode3, node3Host, node3Port);
    let permitted = await nodeRulesContract.enodePermitted(enode3, node3Host, node3Port);
    assert.notOk(permitted, 'expected removed node NOT permitted');

    permitted = await nodeRulesContract.connectionAllowed(enode3, node3Host, node3Port);
    assert.equal(permitted, false, 'expected source disallowed since it was removed');

    let result = await nodeRulesContract.getSize();
    assert.equal(result, 2, "expected number of nodes");
  });

  it('should permit a node added back to the list', async () => {
    let permitted = await nodeRulesContract.enodePermitted(enode3, node3Host, node3Port);
    assert.notOk(permitted, 'expected removed node NOT permitted');

    await nodeRulesContract.addEnode(enode3, node3Host, node3Port);
    permitted = await nodeRulesContract.enodePermitted(enode3, node3Host, node3Port);
    assert.ok(permitted, 'expected added node permitted');

    permitted = await nodeRulesContract.connectionAllowed(enode3, node3Host, node3Port,);
    assert.equal(permitted, true, 'expected connection allowed since node was added back to list');
  });

  it('should not allow non-admin account to add node to list', async () => {
    try {
      await nodeRulesContract.addEnode(enode1, node1Host, node1Port, { from: accounts[1] });
      expect.fail(null, null, "Modifier was not enforced")
    } catch(err) {
      expect(err.reason).to.contain('Sender not authorized');
    }
  });

  it('should not allow non-admin account to remove node from list', async () => {
    try {
      await nodeRulesContract.addEnode(enode1, node1Host, node1Port, { from: accounts[1] });
      expect.fail(null, null, "Modifier was not enforced")
    } catch(err) {
      expect(err.reason).to.contain('Sender not authorized');
    }
  });

  it('should allow new admin account to remove node from list', async () => {
    await adminContract.addAdmin(accounts[1]);

    await nodeRulesContract.removeEnode(enode1, node1Host, node1Port, { from: accounts[1] });

    let permitted = await nodeRulesContract.enodePermitted(enode1, node1Host, node1Port);
    assert.notOk(permitted, 'expected added node NOT permitted');
  });

  it('should allow new admin account to add node to list', async () => {
    await adminContract.addAdmin(accounts[2]);

    await nodeRulesContract.addEnode(enode1, node1Host, node1Port, { from: accounts[2] });

    let permitted = await nodeRulesContract.enodePermitted(enode1, node1Host, node1Port);
    assert.ok(permitted, 'expected added node permitted');
  });
});
