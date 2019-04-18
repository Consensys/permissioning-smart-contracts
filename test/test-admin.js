const Admin = artifacts.require('Admin.sol');

contract("Admin (admin management)", async accounts => {

  let adminContract;

  beforeEach(async () => {
    adminContract = await Admin.new();
  })

  it("accounts that deployed contract should be admin", async () => {
    let isAuthorized = await adminContract.isAuthorized(accounts[0]);

    assert.ok(isAuthorized);
  });

  it("non-deployer account should not be admin", async () => {
    let isAuthorized = await adminContract.isAuthorized(accounts[1]);

    assert.notOk(isAuthorized);
  });

  it("non admin cannot add another admin", async () => {
    try {
      await adminContract.addAdmin(accounts[2], { from: accounts[1] });
      expect.fail(null, null, "Modifier was not enforced")
    } catch(err) {
      expect(err.reason).to.contain('Sender not authorized');
    }
  });

  it("admin can add another admin", async () => {
    await adminContract.addAdmin(accounts[2], { from: accounts[0] });
    let isAuthorized = await adminContract.isAuthorized(accounts[2]);
    assert.ok(isAuthorized);
  });

  it("admin cannot try to add himself", async () => {
    try {
      await adminContract.addAdmin(accounts[0], { from: accounts[0] });
      expect.fail(null, null, "Modifier was not enforced")
    } catch(err) {
      expect(err.reason).to.contain("Cannnot invoke method with own account as parameter");
    }
  });

  it("non admin cannot remove another admin", async () => {
    try {
      await adminContract.removeAdmin(accounts[2], { from: accounts[1] });
      expect.fail(null, null, "Modifier was not enforced")
    } catch(err) {
      expect(err.reason).to.contain("Sender not authorized");
    }
  });

  it("admin can remove another admin", async () => {
    await adminContract.addAdmin(accounts[2], { from: accounts[0] });
    let isAuthorized = await adminContract.isAuthorized(accounts[2]);
    assert.ok(isAuthorized);

    tx = await adminContract.removeAdmin(accounts[2], { from: accounts[0] });
    isAuthorized = await adminContract.isAuthorized(accounts[2]);
    assert.notOk(isAuthorized);
  });

  it("admin cannot remove himself", async () => {
    try {
      await adminContract.removeAdmin(accounts[0], { from: accounts[0] });
      expect.fail(null, null, "Modifier was not enforced")
    } catch(err) {
      expect(err.reason).to.contain("Cannnot invoke method with own account as parameter");
    }
  });

  it("get admins list", async () => {
    let admins = await adminContract.getAdmins.call();

    assert.sameMembers([accounts[0]], admins)
  });

  it("get admins list reflect changes", async () => {
    let admins = await adminContract.getAdmins.call();
    assert.sameMembers([accounts[0]], admins)

    await adminContract.addAdmin(accounts[1], { from: accounts[0] });
    admins = await adminContract.getAdmins.call();
    assert.sameMembers([accounts[0], accounts[1]], admins);

    await adminContract.addAdmin(accounts[2], { from: accounts[0] });
    admins = await adminContract.getAdmins.call();
    assert.sameMembers([accounts[0], accounts[1], accounts[2]], admins);

    await adminContract.removeAdmin(accounts[1], { from: accounts[0] });
    admins = await adminContract.getAdmins.call();
    assert.sameMembers([accounts[0], accounts[2]], admins);
  });
});