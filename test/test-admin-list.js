const Admin = artifacts.require('ExposedAdminList.sol');

contract("AdminList (list manipulation)", async () => {

  let adminContract;

  beforeEach(async () => {
    adminContract = await Admin.new();
  });

  it("should start with an empty list of admins", async () => {
    let size = await adminContract._size();

    assert.equal(size, 0);
  });

  it("size method reflect list size", async () => {
    await adminContract._add("0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c");
    await adminContract._add("0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C");
    await adminContract._add("0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB");

    let size = await adminContract._size();
    assert.equal(size, 3);
  });

  it("exists should return true for existing address", async () => {
    await adminContract._add("0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c");

    let exists = await adminContract._exists("0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c");

    assert.ok(exists);
  });

  it("exists should return false for absent address", async () => {
    // adding another address so list is not empty
    await adminContract._add("0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB");

    let exists = await adminContract._exists("0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c");

    assert.notOk(exists);
  });

  it("exists should return false when list is empty", async () => {
    let exists = await adminContract._exists("0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c");

    assert.notOk(exists);
  });

  it("add address to list should add node to the list and increase list size", async () => {
    const address = "0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c";

    let exists = await adminContract._exists(address);
    assert.notOk(exists);
    let size = await adminContract._size();
    assert.equal(size, 0);

    await adminContract._add(address);

    exists = await adminContract._exists(address);
    assert.ok(exists);
    size = await adminContract._size();
    assert.equal(size, 1);
  });

  it("add existing address should do nothing on second insert", async () => {
    const address = "0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c";

    await adminContract._add(address);
    await adminContract._add(address);

    let size = await adminContract._size();
    assert.equal(size, 1);

    let exists = await adminContract._exists(address);
    assert.ok(exists);
  });

  it("remove absent address should not fail", async () => {
    let txResult = await adminContract._remove("0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c");

    assert.ok(txResult.receipt.status);
  });

  it("remove address from list should remove address from list and decrease list size", async () => {
    const address = "0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c";

    await adminContract._add(address);
    let size = await adminContract._size();
    assert.equal(size, 1);
    let exists = await adminContract._exists(address);
    assert.ok(exists);

    await adminContract._remove(address);

    size = await adminContract._size();
    assert.equal(size, 0);
    exists = await adminContract._exists(address);
    assert.notOk(exists);
  });
});
