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

  it("remove address in the middle of list should maintain list order", async () => {
    let addresses = [
      "0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c",
      "0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C",
      "0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB"
    ]

    await adminContract._add(addresses[0]);
    await adminContract._add(addresses[1]);
    await adminContract._add(addresses[2]);

    node = await adminContract._get(1);
    assert.equal(node.__address, addresses[1]);

    await adminContract._remove(addresses[1]);

    node = await adminContract._get(1);
    assert.equal(node.__address, addresses[2]);
  });

  it("get by index on empty list should return false", async () => {
    let node = await adminContract._get(0);

    assert.notOk(node.__exists);
    assert.equal(node.__address, "0x0000000000000000000000000000000000000000");
  });

  it("get by index returns expected order", async () => {
    let addresses = [
      "0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c",
      "0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C",
      "0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB"
    ]

    await adminContract._add(addresses[0]);
    await adminContract._add(addresses[1]);
    await adminContract._add(addresses[2]);

    let node = await adminContract._get(0);
    assert.equal(node.__address, addresses[0]);

    node = await adminContract._get(1);
    assert.equal(node.__address, addresses[1]);

    node = await adminContract._get(2);
    assert.equal(node.__address, addresses[2]);
  });

  it("getAll return empty array when admin list is empty", async () => {
    let returnedAddresses = await adminContract._getAll();
    assert.isEmpty(returnedAddresses);
  });

  it("getAll return all accounts in expected order", async () => {
    let addresses = [
      "0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c",
      "0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C",
      "0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB"
    ]

    await adminContract._add(addresses[0]);
    await adminContract._add(addresses[1]);
    await adminContract._add(addresses[2]);

    let returnedAddresses = await adminContract._getAll();
    expect(returnedAddresses).to.have.ordered.members(addresses);
  });
});