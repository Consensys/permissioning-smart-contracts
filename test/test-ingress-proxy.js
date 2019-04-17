const Ingress = artifacts.require('Ingress.sol');
const Rules = artifacts.require('Rules.sol');
const Admin = artifacts.require('Admin.sol');

const RULES='0x72756c6573000000000000000000000000000000000000000000000000000000';
const ADMIN='0x61646d696e697374726174696f6e000000000000000000000000000000000000';

var node1High = "0x9bd359fdc3a2ed5df436c3d8914b1532740128929892092b7fcb320c1b62f375";
var node1Low = "0x2e1092b7fcb320c1b62f3759bd359fdc3a2ed5df436c3d8914b1532740128929";
var node1Host = "0x0000000000000000000011119bd359fd";
var node1Port = 1;

var node2High = "0x892092b7fcb320c1b62f3759bd359fdc3a2ed5df436c3d8914b1532740128929";
var node2Low = "0xcb320c1b62f37892092b7f59bd359fdc3a2ed5df436c3d8914b1532740128929";
var node2Host = "0x0000000000000000000011119bd359fd";
var node2Port = 2;

contract ('Ingress (proxying permissioning check to rules contract)', () => {

  let ingressContract;
  let rulesContract;
  let adminContract;

  beforeEach(async () => {
    ingressContract = await Ingress.new();
    adminContract = await Admin.new();
    await ingressContract.setContractAddress(ADMIN, adminContract.address);
    rulesContract = await Rules.new(ingressContract.address);
  });

  it('Should execute proxied call correctly', async () => {
    let result;
    let result2;

    await ingressContract.setContractAddress(RULES, rulesContract.address);

    // Verify that the nodes are not permitted to talk
    result = await ingressContract.connectionAllowed(node1High, node1Low, node1Host, node1Port, node2High, node2Low, node2Host, node2Port);
    result2 = await rulesContract.connectionAllowed(node1High, node1Low, node1Host, node1Port, node2High, node2Low, node2Host, node2Port);
    // assert.equal(result, false, "Connection should NOT be allowed before Enodes have been registered");
    assert.equal(result, result2, "Call and proxy call did NOT return the same value");

    // Add the two Enodes to the Rules register
    result = await rulesContract.addEnode(node1High, node1Low, node1Host, node1Port);
    result = await rulesContract.addEnode(node2High, node2Low, node2Host, node2Port);

    // Verify that the nodes are now able to talk
    result = await ingressContract.connectionAllowed(node1High, node1Low, node1Host, node1Port, node2High, node2Low, node2Host, node2Port);
    result2 = await rulesContract.connectionAllowed(node1High, node1Low, node1Host, node1Port, node2High, node2Low, node2Host, node2Port);
    assert.equal(result, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", "Connection SHOULD be allowed after Enodes have been registered");
    assert.equal(result, result2, "Call and proxy call did NOT return the same value");
  });

  it('Should permit changing active Rules contract addresses', async () => {
    let result;
    let result2;

    // const icProxy = await Ingress.new();
    const rcProxy1 = await Rules.new(ingressContract.address);
    const rcProxy2 = await Rules.new(ingressContract.address);

    // Verify that the Rules contract has not been registered
    result = await ingressContract.getContractAddress(RULES);
    assert.equal(result, "0x0000000000000000000000000000000000000000", 'Rules contract should NOT already be registered');

    // Register the initial Rules contract
    await ingressContract.setContractAddress(RULES, rcProxy1.address);

    // Verify the initial rules contract has been registered
    result = await ingressContract.getContractAddress(RULES);
    assert.equal(result, rcProxy1.address, 'Initial contract has NOT been registered correctly');

    // Verify that the newly registered contract is the initial version
    let contract = await Rules.at(result);
    result = await contract.getContractVersion();
    assert.equal(web3.utils.toDecimal(result), 1000000, 'Initial contract is NOT the correct version');

    // Verify that the nodes are not permitted to talk
    result = await ingressContract.connectionAllowed(node1High, node1Low, node1Host, node1Port, node2High, node2Low, node2Host, node2Port);
    result2 = await rcProxy1.connectionAllowed(node1High, node1Low, node1Host, node1Port, node2High, node2Low, node2Host, node2Port);
    assert.equal(result, "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", "Connection should NOT be allowed before Enodes have been registered");
    assert.equal(result, result2, "Call and proxy call did NOT return the same value");

    // Add the two Enodes to the Rules register
    result = await rcProxy1.addEnode(node1High, node1Low, node1Host, node1Port);
    result = await rcProxy1.addEnode(node2High, node2Low, node2Host, node2Port);

    // Verify that the nodes are now able to talk
    result = await ingressContract.connectionAllowed(node1High, node1Low, node1Host, node1Port, node2High, node2Low, node2Host, node2Port);
    result2 = await rcProxy1.connectionAllowed(node1High, node1Low, node1Host, node1Port, node2High, node2Low, node2Host, node2Port);
    assert.equal(result, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", "Connection SHOULD be allowed after Enodes have been registered");
    assert.equal(result, result2, "Call and proxy call did NOT return the same value");

    // Register the updated Rules contract
    await ingressContract.setContractAddress(RULES, rcProxy2.address);

    // Verify the updated rules contract has been registered
    result = await ingressContract.getContractAddress(RULES);
    assert.equal(result, rcProxy2.address, 'Updated contract has NOT been registered correctly');

    // Verify that the newly registered contract is the updated version
    contract = await Rules.at(result);
    result = await contract.getContractVersion();
    assert.equal(web3.utils.toDecimal(result), 1000000, 'Updated contract is NOT the correct version');

    // Verify that the nodes are not permitted to talk
    result = await ingressContract.connectionAllowed(node1High, node1Low, node1Host, node1Port, node2High, node2Low, node2Host, node2Port);
    result2 = await rcProxy2.connectionAllowed(node1High, node1Low, node1Host, node1Port, node2High, node2Low, node2Host, node2Port);
    assert.equal(result, "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", "Connection should NOT be allowed before Enodes have been registered");
    assert.equal(result, result2, "Call and proxy call did NOT return the same value");
  });
});