const BN = web3.utils.BN;
const { AddressZero } = require("ethers/constants");

const RulesList = artifacts.require('ExposedNodeRulesList.sol');
const NodeStorage = artifacts.require('NodeStorage.sol');

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

contract("NodeStorage (access control)", async () => {

  let rulesListContract;
  let storageContract;

  beforeEach(async () => {
    rulesListContract = await RulesList.new();
    // initialize the storage
    storageContract = await NodeStorage.new(AddressZero);
    console.log("   >>> Storage contract deployed with address = " + storageContract.address);
    // set rules -> storage
    rulesListContract._setStorage(storageContract.address);
    // set rules as the storage owner: storage -> rules
    await storageContract.upgradeVersion(rulesListContract.address);
    console.log("   >>> Set storage owner to Rules.address " + rulesListContract.address);
  });


  it("should allow add when calling from RuleList", async () => {
    await rulesListContract._add(enode1, node1Host, node1Port);

    let size = await rulesListContract._size();
    assert.equal(size, 1);
  });

  it("should deny when calling from other than RuleList", async () => {
    try {
        await storageContract.add(enode1, node1Host, node1Port);
        assert.fail("Unauthorized sender was allowed to add a node")
    } catch (err) {
        assert.isOk(err.toString().includes("only the latestVersion can modify the list"), "Expected revert in message");
    }
  });

  it("should allow remove when calling from RuleList", async () => {
    let txResult = await rulesListContract._remove(enode1, node1Host, node1Port);
    assert.ok(txResult.receipt.status);
  });

  it("should deny when calling  from other than RuleList", async () => {
    try {
        await storageContract.remove(enode1, node1Host, node1Port);
        assert.fail("Unauthorized sender was allowed to add a node")
    } catch (err) {
        assert.isOk(err.toString().includes("only the latestVersion can modify the list"), "Expected revert in message");
    }
  });


});
