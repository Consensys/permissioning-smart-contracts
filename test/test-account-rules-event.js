const IngressContract = artifacts.require('Ingress.sol');
const RulesContract = artifacts.require('AccountRules.sol');
const AdminContract = artifacts.require('Admin.sol');
const RulesStorage = artifacts.require('AccountStorage.sol');

// Contract keys
const RULES_NAME = "0x72756c6573000000000000000000000000000000000000000000000000000000";
const ADMIN_NAME = "0x61646d696e697374726174696f6e000000000000000000000000000000000000";

var address1 = "0xdE3422671D38EcdD7A75702Db7f54d4b30C022Ea".toLowerCase();

const newAdmin = "f17f52151EbEF6C7334FAD080c5704D77216b732";

contract("Account Rules (Events & Management)", (accounts) => {
    let ingressContract;
    let rulesContract;
    let adminContract;
    let storageContract;

    before(async () => {
      ingressContract = await IngressContract.new();

      adminContract = await AdminContract.new();
      await ingressContract.setContractAddress(ADMIN_NAME, adminContract.address);

      // initialize storage
      storageContract = await RulesStorage.new(ingressContract.address);
      console.log("   >>> Storage contract deployed with address = " + storageContract.address);

      // setup rules -> storage
      rulesContract = await RulesContract.new(ingressContract.address, storageContract.address);
      await ingressContract.setContractAddress(RULES_NAME, rulesContract.address);

      // set storage -> rules
      await storageContract.upgradeVersion(rulesContract.address);
      console.log("   >>> Set storage owner to Rules.address " + rulesContract.address);

      // assert initial state
      let size = await rulesContract.getSize();
      assert.equal(size, 1, "Allowlist initializes with 1 account");
      let initialAccount = await rulesContract.getByIndex(0);
      assert.equal(initialAccount, accounts[0], "Allowlist initializes allowing deploying account");
      await rulesContract.removeAccount(initialAccount);
    });

    it("Should return contract version", async () => {
        let result = await rulesContract.getContractVersion.call();
        assert.isNotNull(result);
    });

    it("getAccounts return empty array when account list is empty", async () => {
        let returnedAddresses = await rulesContract.getAccounts();
        assert.isEmpty(returnedAddresses);
    });

    it("Should emit an event when an account is added", async () => {   
        // Add an account
        await rulesContract.addAccount(address1);

        // Attempt to add a duplicate entry
        await rulesContract.addAccount(address1);

        // Get the events
        let result = await rulesContract.getPastEvents("AccountAdded", {fromBlock: 0, toBlock: "latest" });

        // Verify the successful AccountAdded event is 'true'
        assert.equal(result[0].returnValues.accountAdded, true, "accountAdded SHOULD be true");
        assert.equal(result[0].returnValues.accountAddress.toLowerCase(), address1, "account address SHOULD be " + address1);

        // Verify the unsuccessful duplicate AccountAdded event is 'false'
        assert.equal(result[1].returnValues.accountAdded, false, "duplicate accountAdded SHOULD be false");
        assert.equal(result[1].returnValues.accountAddress.toLowerCase(), address1, "duplicate account address SHOULD be " + address1);
    });

    it("Should emit events when multiple accounts are added", async () => {
        // Add an account (and duplicate of it)
        await rulesContract.addAccounts([address1,address1]);

        // Get the events
        let result = await rulesContract.getPastEvents("AccountAdded", {fromBlock: 0, toBlock: "latest" });

        // Verify the successful AccountAdded event is 'true'
        assert.equal(result[0].returnValues.accountAdded, true, "accountAdded SHOULD be true");
        assert.equal(result[0].returnValues.accountAddress.toLowerCase(), address1, "account address SHOULD be " + address1);

        // Verify the unsuccessful duplicate AccountAdded event is 'false'
        assert.equal(result[1].returnValues.accountAdded, false, "duplicate accountAdded SHOULD be false");
        assert.equal(result[1].returnValues.accountAddress.toLowerCase(), address1, "duplicate account address SHOULD be " + address1);
    });

    it("Should emit an event when an account is removed", async () => {
        // Add an account
        await rulesContract.addAccount(address1);

        await rulesContract.removeAccount(address1);
        await rulesContract.removeAccount(address1);

        // Get the events
        let result = await rulesContract.getPastEvents("AccountRemoved", {fromBlock: 0, toBlock: "latest" });

        // Verify the successful AccountRemoved event is 'true'
        assert.equal(result[1].returnValues.accountRemoved, true, "accountRemoved SHOULD be true");
        assert.equal(result[1].returnValues.accountAddress.toLowerCase(), address1, "account address SHOULD be " + address1);

        // Verify the unsuccessful duplicate AccountRemoved event is 'false'
        assert.equal(result[2].returnValues.accountRemoved, false, "duplicate accountRemoved SHOULD be false");
        assert.equal(result[2].returnValues.accountAddress.toLowerCase(), address1, "duplicate account address SHOULD be " + address1);
    });
});
