const Ingress = artifacts.require('Ingress.sol');
const Rules = artifacts.require('Rules.sol');
const Admin = artifacts.require('Admin.sol');

var node1High = "0x9bd359fdc3a2ed5df436c3d8914b1532740128929892092b7fcb320c1b62f375";
var node1Low = "0x892092b7fcb320c1b62f3759bd359fdc3a2ed5df436c3d8914b1532740128929";
var node1Host = "0x0000000000000000000011119bd359fd";
var node1Port = 30303;

var newAdmin = "f17f52151EbEF6C7334FAD080c5704D77216b732".toLowerCase();
var newAdmin2 = "fe3b557e8fb62b89f4916b721be55ceb828dbd73".toLowerCase();

contract('Rules (Read-only mode)', () => {

  let ingressContract;
  let adminContract;
  let rulesContract;

  beforeEach(async () => {
    ingressContract = await Ingress.deployed();
    rulesContract = await Rules.new(Ingress.address);
  })

  it("should toggle read-only flag on enter/exit read-mode method invocation", async () => {
    let readOnly = await rulesContract.isReadOnly();
    assert.notOk(readOnly);

    await rulesContract.enterReadOnly();

    readOnly = await rulesContract.isReadOnly();
    assert.ok(readOnly);

    await rulesContract.exitReadOnly();

    readOnly = await rulesContract.isReadOnly();
    assert.notOk(readOnly);
  });

  it("should fail when adding enode in read-only mode", async () => {
    await rulesContract.enterReadOnly();

    try {
      await rulesContract.addEnode(node1High, node1Low, node1Host, node1Port);
      assert.fail("Expected error when adding enode on readOnly mode");
    } catch (err) {
      expect(err.reason).to.contain("In read only mode: rules cannot be modified");
    }
  });

  it("should fail when removing enode in read-only mode", async () => {
    await rulesContract.enterReadOnly();

    try {
      await rulesContract.removeEnode(node1High, node1Low, node1Host, node1Port);
      assert.fail("Expected error when adding enode on readOnly mode");
    } catch (err) {
      expect(err.reason).to.contain("In read only mode: rules cannot be modified");
    }
  });

  it("should fail when attempting to exit read-only mode and contract is not in read-only mode", async () => {

    try {
      await rulesContract.exitReadOnly();
      assert.fail("Expected error when exiting read-only mode not being in read-only mode");
    } catch (err) {
      expect(err.reason).to.contain("Not in read only mode");
    }
  });

  it("should fail when attempting to enter read-only mode and contract is alread in read-only mode", async () => {
    await rulesContract.enterReadOnly();

    try {
      await rulesContract.enterReadOnly();
      assert.fail("Expected error when entering read-only mode being in read-only mode");
    } catch (err) {
      expect(err.reason).to.contain("Already in read only mode");
    }
  });
});
