const NodeIngress = artifacts.require('NodeIngress.sol');
const NodeRules = artifacts.require('NodeRules.sol');
const Admin = artifacts.require('Admin.sol');
const RulesStorage = artifacts.require('NodeStorage.sol');

const RULES='0x72756c6573000000000000000000000000000000000000000000000000000000';
const ADMIN='0x61646d696e697374726174696f6e000000000000000000000000000000000000';

var enode1 = "9bd359fdc3a2ed5df436c3d8914b1532740128929892092b7fcb320c1b62f375"
+ "2e1092b7fcb320c1b62f3759bd359fdc3a2ed5df436c3d8914b1532740128929";
var node1Host = "127.0.0.1";
var node1Port = 1;

contract ('NodeIngress (proxying permissioning check to rules contract)', () => {

  let nodeIngressContract;
  let nodeRulesContract;
  let adminContract;
  let storageContract;

  beforeEach(async () => {
    nodeIngressContract = await NodeIngress.new();
    adminContract = await Admin.new();

    // set the storage
    storageContract = await RulesStorage.new(nodeIngressContract.address);
    console.log("   >>> Storage contract deployed with address = " + storageContract.address);
    
    await nodeIngressContract.setContractAddress(ADMIN, adminContract.address);
    nodeRulesContract = await NodeRules.new(nodeIngressContract.address, storageContract.address);

    // set rules as the storage owner
    await storageContract.upgradeVersion(nodeRulesContract.address);
    console.log("   >>> Set storage owner to Rules.address");

    result = await nodeIngressContract.getContractAddress(ADMIN);
    assert.equal(result, adminContract.address, 'Admin contract should be reg');
  });

  it('Should execute proxied call correctly', async () => {
    let result;
    let result2;

    await nodeIngressContract.setContractAddress(RULES, nodeRulesContract.address);

    result = await nodeIngressContract.getContractAddress(ADMIN);
    assert.equal(result, adminContract.address, 'Admin contract should be reg');

    // Verify that the NodeRules contract has been registered
    result = await nodeIngressContract.getContractAddress(RULES);
    assert.equal(result, nodeRulesContract.address, 'NodeRules contract should be reg');

    // Verify that the nodes are not permitted to talk
    result2 = await nodeRulesContract.connectionAllowed(enode1, node1Host, node1Port);
    result = await nodeIngressContract.connectionAllowed(enode1, node1Host, node1Port);
    assert.equal(result, false, "Connection should NOT be allowed before Enodes have been registered");
    assert.equal(result, result2, "Call and proxy call did NOT return the same value");

    // Add the Enode to the NodeRules register
    result = await nodeRulesContract.addEnode(enode1, node1Host, node1Port);

    // Verify that the nodes are now able to talk
    result = await nodeIngressContract.connectionAllowed(enode1, node1Host, node1Port);
    result2 = await nodeRulesContract.connectionAllowed(enode1, node1Host, node1Port);
    assert.equal(result, true, "Connection SHOULD be allowed after Enodes have been registered");
    assert.equal(result, result2, "Call and proxy call did NOT return the same value");
  });

  it('Should permit changing active NodeRules contract addresses WHILE keeping existing storage', async () => {
    let result;

    // Verify that the NodeRules contract has not been registered
    result = await nodeIngressContract.getContractAddress(RULES);
    assert.equal(result, "0x0000000000000000000000000000000000000000", 'NodeRules contract should NOT already be registered');

    // Register the initial NodeRules contract
    await nodeIngressContract.setContractAddress(RULES, nodeRulesContract.address);
    // Verify the initial rules contract has been registered
    result = await nodeIngressContract.getContractAddress(RULES);
    assert.equal(result, nodeRulesContract.address, 'Initial contract has NOT been registered correctly');

    // Add the Enode to the NodeRules register
    result = await nodeRulesContract.addEnode(enode1, node1Host, node1Port);

    // Verify that the node is permitted
    result = await nodeIngressContract.connectionAllowed(enode1, node1Host, node1Port);
    assert.equal(result, true, "Connection SHOULD be allowed after Enodes have been registered");

    // create a NEW Rules contract
    const rcProxy1 = await NodeRules.new(nodeIngressContract.address, storageContract.address);
    // existing rules calls upgrade to change storage owner to the new one
    storageContract.upgradeVersion(rcProxy1.address);

    // Register the NEW NodeRules contract
    await nodeIngressContract.setContractAddress(RULES, rcProxy1.address);

    // Verify the NEW rules contract has been registered
    result = await nodeIngressContract.getContractAddress(RULES);
    assert.equal(result, rcProxy1.address, 'NEW Rules contract has NOT been registered correctly');

    // Verify that the newly registered contract is the correct version
    let contract = await NodeRules.at(result);
    result = await contract.getContractVersion();
    assert.equal(web3.utils.toDecimal(result), 3000000, 'Rules contract is NOT the correct version');

    // Verify that the node is permitted
    result = await nodeIngressContract.connectionAllowed(enode1, node1Host, node1Port);
    assert.equal(result, true, "Connection SHOULD be allowed after Enodes have been registered");

  });
});