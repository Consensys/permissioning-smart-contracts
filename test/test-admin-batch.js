const BN = web3.utils.BN;
const RulesList = artifacts.require('ExposedAdminList.sol');

var address1 = "0xdE3422671D38EcdD7A75702Db7f54d4b30C022Ea".toLowerCase();
var address2 = "0xf17f52151EbEF6C7334FAD080c5704D77216b732".toLowerCase();
var address3 = "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73".toLowerCase();

contract("Admin batch (list manipulation)", async () => {

  let rulesListContract;

  beforeEach(async () => {
    rulesListContract = await RulesList.new();
  });

  it("batch add 3 different addresses to list should add to the list and increase list size", async () => {
    let exists = await rulesListContract._exists(address3);
    assert.notOk(exists);
    let size = await rulesListContract._size();
    assert.equal(size, 0);

    let allAdded = await rulesListContract._addBatch([address1,address2,address3]);

    // assert all three were added
    exists = await rulesListContract._exists(address3);
    assert.ok(exists);
    exists = await rulesListContract._exists(address2);
    assert.ok(exists);
    exists = await rulesListContract._exists(address1);
    assert.ok(exists);

    size = await rulesListContract._size();
    assert.equal(size, 3);

    assert.ok(allAdded);
  });

  it("batch add 3 addresses with a duplicate to list should add 2 to the list and increase list size by 2", async () => {
    let exists = await rulesListContract._exists(address3);
    assert.notOk(exists);
    let size = await rulesListContract._size();
    assert.equal(size, 0);

    await rulesListContract._add(address1);

    let allAdded = await rulesListContract._addBatch([address1,address3]);

    exists = await rulesListContract._exists(address1);
    assert.ok(exists);
    exists = await rulesListContract._exists(address3);
    assert.ok(exists);

    size = await rulesListContract._size();
    assert.equal(size, 2);

    assert.ok(allAdded);
  });

  it("batch add 3 addresses with a duplicate to list should add 2 to the list and increase list size by 2", async () => {
    let exists = await rulesListContract._exists(address3);
    assert.notOk(exists);
    let size = await rulesListContract._size();
    assert.equal(size, 0);

    let allAdded = await rulesListContract._addBatch([address1,address1,address3]);

    exists = await rulesListContract._exists(address1);
    assert.ok(exists);
    exists = await rulesListContract._exists(address3);
    assert.ok(exists);

    size = await rulesListContract._size();
    assert.equal(size, 2);

    assert.ok(allAdded);
  });
});