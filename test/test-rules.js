const IngressContract = artifacts.require('Ingress.sol');
const RulesContract = artifacts.require('Rules.sol');
const AdminContract = artifacts.require('Admin.sol');

// Contract keys
const RULES_NAME = "0x72756c6573000000000000000000000000000000000000000000000000000000";
const ADMIN_NAME = "0x61646d696e697374726174696f6e000000000000000000000000000000000000";

var node1High = "0x9bd359fdc3a2ed5df436c3d8914b1532740128929892092b7fcb320c1b62f375";
var node1Low = "0x2e1092b7fcb320c1b62f3759bd359fdc3a2ed5df436c3d8914b1532740128929";
var node1Host = "0x0000000000000000000011119bd359fd";
var node1Port = 30303;

var node2High = "0x892092b7fcb320c1b62f3759bd359fdc3a2ed5df436c3d8914b1532740128929";
var node2Low = "0xcb320c1b62f37892092b7f59bd359fdc3a2ed5df436c3d8914b1532740128929";
var node2Host = "0x0000000000000000000011119bd359fd";
var node2Port = 30304;

var node3High = "0x765092b7fcb320c1b62f3759bd359fdc3a2ed5df436c3d8914b1532740128929";
var node3Low = "0x920982b7fcb320c1b62f3759bd359fdc3a2ed5df436c3d8914b1532740128929";
var node3Host = "0x0000000000000000000011117fc359fd";
var node3Port = 30305;

var newAdmin = "f17f52151EbEF6C7334FAD080c5704D77216b732";

contract("Rules", () => {
  let ingressContract;
  let rulesContract;
  let adminContract;

  before(async () => {
    ingressContract = await IngressContract.new();
    adminContract = await AdminContract.new();
    result = await ingressContract.setContractAddress(ADMIN_NAME, adminContract.address);
    rulesContract = await RulesContract.new(ingressContract.address);
  });

  it('Should NOT permit any node when none have been added', async () => {
    ingressContract = await IngressContract.new();
    result = await ingressContract.setContractAddress(ADMIN_NAME, adminContract.address);
    rulesContract = await RulesContract.new(ingressContract.address);

    let permitted = await rulesContract.enodeAllowed(node1High, node1Low, node1Host, node1Port);
    assert.equal(permitted, false, 'expected node NOT permitted');
  });

  it('Should NOT be able to remove enode from empty list', async () => {
    await rulesContract.removeEnode(node3High, node3Low, node3Host, node3Port);
    let permitted = await rulesContract.enodeAllowed(node3High, node3Low, node3Host, node3Port);
    assert.equal(permitted, false, 'expected removed node NOT permitted');
  });

  it('Should compute key', async () => {
    let key1 = await rulesContract.computeKey(node1High, node1Low, node1Host, node1Port);
    let key2 = await rulesContract.computeKey(node1High, node1Low, node1Host, node1Port);
    assert.equal(key1, key2, "computed keys should be the same");

    let key3 = await rulesContract.computeKey(node1High, node1Low, node1Host, node2Port);
    assert(key3 != key2, "keys for different ports should be different");
  });

  it('Should add a node to the whitelist and then permit that node', async () => {
    // Register the Rules contract to permit adding enodes
    await ingressContract.setContractAddress(RULES_NAME, rulesContract.address);

    // add node1
    await rulesContract.addEnode(node1High, node1Low, node1Host, node1Port);
    let permitted = await rulesContract.enodeAllowed(node1High, node1Low, node1Host, node1Port);
    assert.equal(permitted, true, 'expected node added to be permitted');

    // add node2
    await rulesContract.addEnode(node2High, node2Low, node2Host, node2Port);
    permitted = await rulesContract.enodeAllowed(node2High, node2Low, node2Host, node2Port);
    assert.equal(permitted, true, 'expected node 2 added to be permitted');

    // first one still permitted
    permitted = await rulesContract.enodeAllowed(node1High, node1Low, node1Host, node1Port);
    assert.equal(permitted, true, 'expected node 1 added to be permitted');

    // add node3
    await rulesContract.addEnode(node3High, node3Low, node3Host, node3Port);
    permitted = await rulesContract.enodeAllowed(node3High, node3Low, node3Host, node3Port);
    assert.equal(permitted, true, 'expected node 3 added to be permitted');

    // node1 still permitted
    permitted = await rulesContract.enodeAllowed(node1High, node1Low, node1Host, node1Port);
    assert.equal(permitted, true, 'expected node 1 added to be permitted');
    // node2 still permitted
    permitted = await rulesContract.enodeAllowed(node2High, node2Low, node2Host, node2Port);
    assert.equal(permitted, true, 'expected node 2 added to be permitted');
  });

  it('Should allow a connection between 2 added nodes', async () => {
    let permitted = await rulesContract.connectionAllowed(node1High, node1Low, node1Host, node1Port, node2High, node2Low, node2Host, node2Port);
    assert.equal(permitted, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", 'expected permitted node1 <> node2');
    permitted = await rulesContract.connectionAllowed(node1High, node1Low, node1Host, node1Port, node3High, node3Low, node3Host, node3Port);
    assert.equal(permitted, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", 'expected permitted node1 <> node3');
    permitted = await rulesContract.connectionAllowed(node2High, node2Low, node2Host, node2Port, node3High, node3Low, node3Host, node3Port);
    assert.equal(permitted, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", 'expected permitted node2 <> node3');
  });

  it('Should remove END node from the whitelist and then NOT permit that node', async () => {
    await rulesContract.removeEnode(node3High, node3Low, node3Host, node3Port);
    let permitted = await rulesContract.enodeAllowed(node3High, node3Low, node3Host, node3Port);
    assert.equal(permitted, false, 'expected removed node NOT permitted');

    permitted = await rulesContract.connectionAllowed(node3High, node3Low, node3Host, node3Port, node2High, node2Low, node2Host, node2Port);
    assert.equal(permitted, "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", 'expected source disallowed since it was removed');

    let result = await rulesContract.getKeyCount();
    assert.equal(result, 2, "expected number of nodes");
  });

  it('Should remove a node from the whitelist and then NOT permit that node', async () => {
    await rulesContract.removeEnode(node1High, node1Low, node1Host, node1Port);
    let permitted = await rulesContract.enodeAllowed(node1High, node1Low, node1Host, node1Port);
    assert.equal(permitted, false, 'expected removed node NOT permitted');

    permitted = await rulesContract.connectionAllowed(node1High, node1Low, node1Host, node1Port, node2High, node2Low, node2Host, node2Port);
    assert.equal(permitted, "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", 'expected source disallowed since it was removed');

    let result = await rulesContract.getKeyCount();
    assert.equal(result, 1, "expected number of nodes");
  });

  it('Should remove FINAL node from the whitelist AND then NOT permit that node AND list now empty', async () => {
    await rulesContract.removeEnode(node2High, node2Low, node2Host, node2Port);
    let permitted = await rulesContract.enodeAllowed(node2High, node2Low, node2Host, node2Port);
    assert.equal(permitted, false, 'expected removed node NOT permitted');

    permitted = await rulesContract.connectionAllowed(node1High, node1Low, node1Host, node1Port, node2High, node2Low, node2Host, node2Port);
    assert.equal(permitted, "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", 'expected source disallowed since it was removed');

    let result = await rulesContract.getKeyCount();
    assert.equal(result, 0, "expected number of nodes");
  });

  it('Should add a node to the list after it has been emptied', async () => {
    // no nodes in the list
    let permitted = await rulesContract.enodeAllowed(node2High, node2Low, node2Host, node2Port);
    assert.equal(permitted, false, 'expected removed node NOT permitted');

    permitted = await rulesContract.connectionAllowed(node1High, node1Low, node1Host, node1Port, node2High, node2Low, node2Host, node2Port);
    assert.equal(permitted, "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", 'expected source disallowed since it was removed');

    // add node2
    await rulesContract.addEnode(node2High, node2Low, node2Host, node2Port);
    permitted = await rulesContract.enodeAllowed(node2High, node2Low, node2Host, node2Port);
    assert.equal(permitted, true, 'expected node 2 added to be permitted');

    // should be one node
    let result = await rulesContract.getKeyCount();
    assert.equal(result, 1, "expected number of nodes");
  });
});
