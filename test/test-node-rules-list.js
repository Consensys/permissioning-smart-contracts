const BN = web3.utils.BN;
const { AddressZero } = require("ethers/constants");

const RulesList = artifacts.require('ExposedNodeRulesList.sol');
const RulesStorage = artifacts.require('NodeStorage.sol');

const enode1 = "9bd359fdc3a2ed5df436c3d8914b1532740128929892092b7fcb320c1b62f375"
+ "2e1092b7fcb320c1b62f3759bd359fdc3a2ed5df436c3d8914b1532740128929";
const node1Host = "139.86.2.1";
const node1Port = 30303;
const enode2 = "892092b7fcb320c1b62f3759bd359fdc3a2ed5df436c3d8914b1532740128929"
+ "cb320c1b62f37892092b7f59bd359fdc3a2ed5df436c3d8914b1532740128929";
const node2Host = "127.0.0.1";
const node2Port = 30304;
const enode3 = "765092b7fcb320c1b62f3759bd359fdc3a2ed5df436c3d8914b1532740128929"
+ "920982b7fcb320c1b62f3759bd359fdc3a2ed5df436c3d8914b1532740128929";
const node3Host = "domain.com";
const node3Port = 30305;

contract("NodeRulesList (list manipulation)", async () => {

  let rulesListContract;

  beforeEach(async () => {
    rulesListContract = await RulesList.new();
    // initialize the storage
    storageContract = await RulesStorage.new(AddressZero);
    console.log("   >>> Storage contract deployed with address = " + storageContract.address);
    // set rules -> storage
    rulesListContract._setStorage(storageContract.address);
    // set rules as the storage owner: storage -> rules
    await storageContract.upgradeVersion(rulesListContract.address);
    console.log("   >>> Set storage owner to Rules.address " + rulesListContract.address);
  });

  it("should calculate same key for same enode", async () => {
    let key1 = new BN(await rulesListContract._calculateKey(enode1, node1Host, node1Port));
    let key2 = new BN(await rulesListContract._calculateKey(enode1, node1Host, node1Port));

    assert.ok(key1.eq(key2))
  });

  it("should calculate different key for different enode", async () => {
    let key1 = new BN(await rulesListContract._calculateKey(enode1, node1Host, node1Port));
    let key2 = new BN(await rulesListContract._calculateKey(enode2, node2Host, node2Port));

    assert.notOk(key1.eq(key2))
  });

  it("should start with an empty list of rules", async () => {
    let size = await rulesListContract._size();

    assert.equal(size, 0);
  });

  it("size method reflect list size", async () => {
    await rulesListContract._add(enode1, node1Host, node1Port);
    await rulesListContract._add(enode2, node2Host, node2Port);
    await rulesListContract._add(enode3, node3Host, node3Port);

    let size = await rulesListContract._size();
    assert.equal(size, 3);
  });

  it("exists should return true for existing address", async () => {
    await rulesListContract._add(enode1, node1Host, node1Port);

    let exists = await rulesListContract._exists(enode1, node1Host, node1Port);

    assert.ok(exists);
  });

  it("exists should return false for absent address", async () => {
    // adding another address so list is not empty
    await rulesListContract._add(enode1, node1Host, node1Port);

    let exists = await rulesListContract._exists(enode2, node2Host, node2Port);

    assert.notOk(exists);
  });

  it("exists should return false when list is empty", async () => {
    let exists = await rulesListContract._exists(enode1, node1Host, node1Port);

    assert.notOk(exists);
  });

  it("add enode to list should add node to the list and increase list size", async () => {
    let exists = await rulesListContract._exists(enode1, node1Host, node1Port);
    assert.notOk(exists);
    let size = await rulesListContract._size();
    assert.equal(size, 0);

    await rulesListContract._add(enode1, node1Host, node1Port);

    exists = await rulesListContract._exists(enode1, node1Host, node1Port);
    assert.ok(exists);
    size = await rulesListContract._size();
    assert.equal(size, 1);
  });

  it("add existing enode should do nothing on second insert", async () => {
    await rulesListContract._add(enode1, node1Host, node1Port);
    await rulesListContract._add(enode1, node1Host, node1Port);

    let size = await rulesListContract._size();
    assert.equal(size, 1);

    let exists = await rulesListContract._exists(enode1, node1Host, node1Port);
    assert.ok(exists);
  });

  it("remove absent enode should not fail", async () => {
    let txResult = await rulesListContract._remove(enode1, node1Host, node1Port);

    assert.ok(txResult.receipt.status);
  });

  it("remove enode from list should remove enode from list and decrease list size", async () => {
    await rulesListContract._add(enode1, node1Host, node1Port);
    let size = await rulesListContract._size();
    assert.equal(size, 1);
    let exists = await rulesListContract._exists(enode1, node1Host, node1Port);
    assert.ok(exists);

    await rulesListContract._remove(enode1, node1Host, node1Port);

    size = await rulesListContract._size();
    assert.equal(size, 0);
    exists = await rulesListContract._exists(enode1, node1Host, node1Port);
    assert.notOk(exists);
  });
});
