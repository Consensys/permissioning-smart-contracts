const NodeIngress = artifacts.require('NodeIngress.sol');
const NodeRules = artifacts.require('NodeRules.sol');
const RulesStorage = artifacts.require('NodeStorage.sol');
const Admin = artifacts.require('Admin.sol');

var enode1 = "9bd359fdc3a2ed5df436c3d8914b1532740128929892092b7fcb320c1b62f375"
+ "892092b7fcb320c1b62f3759bd359fdc3a2ed5df436c3d8914b1532740128929";
var node1Host = "127.0.0.1";
var node1Port = 30303;

var newAdmin = "f17f52151EbEF6C7334FAD080c5704D77216b732".toLowerCase();
var newAdmin2 = "fe3b557e8fb62b89f4916b721be55ceb828dbd73".toLowerCase();

contract('NodeRules (Read-only mode)', () => {

  let nodeIngressContract;
  let nodeRulesContract;

  beforeEach(async () => {
    nodeIngressContract = await NodeIngress.deployed();

    // set the storage
    storageContract = await RulesStorage.new(nodeIngressContract.address);
    console.log("   >>> Storage contract deployed with address = " + storageContract.address);
    
    nodeRulesContract = await NodeRules.new(nodeIngressContract.address, storageContract.address);

    // set rules as the storage owner
    await storageContract.upgradeVersion(nodeRulesContract.address);
    console.log("   >>> Set storage owner to Rules.address");
  })

  it("should toggle read-only flag on enter/exit read-mode method invocation", async () => {
    let readOnly = await nodeRulesContract.isReadOnly();
    assert.notOk(readOnly);

    await nodeRulesContract.enterReadOnly();

    readOnly = await nodeRulesContract.isReadOnly();
    assert.ok(readOnly);

    await nodeRulesContract.exitReadOnly();

    readOnly = await nodeRulesContract.isReadOnly();
    assert.notOk(readOnly);
  });

  it("should fail when adding enode in read-only mode", async () => {
    await nodeRulesContract.enterReadOnly();

    try {
      await nodeRulesContract.addEnode(enode1, node1Host, node1Port);
      assert.fail("Expected error when adding enode on readOnly mode");
    } catch (err) {
      expect(err.reason).to.contain("In read only mode: rules cannot be modified");
    }
  });

  it("should fail when removing enode in read-only mode", async () => {
    await nodeRulesContract.enterReadOnly();

    try {
      await nodeRulesContract.removeEnode(enode1, node1Host, node1Port);
      assert.fail("Expected error when adding enode on readOnly mode");
    } catch (err) {
      expect(err.reason).to.contain("In read only mode: rules cannot be modified");
    }
  });

  it("should fail when attempting to exit read-only mode and contract is not in read-only mode", async () => {

    try {
      await nodeRulesContract.exitReadOnly();
      assert.fail("Expected error when exiting read-only mode not being in read-only mode");
    } catch (err) {
      expect(err.reason).to.contain("Not in read only mode");
    }
  });

  it("should fail when attempting to enter read-only mode and contract is alread in read-only mode", async () => {
    await nodeRulesContract.enterReadOnly();

    try {
      await nodeRulesContract.enterReadOnly();
      assert.fail("Expected error when entering read-only mode being in read-only mode");
    } catch (err) {
      expect(err.reason).to.contain("Already in read only mode");
    }
  });
});
