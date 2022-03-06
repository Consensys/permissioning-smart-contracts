const IngressContract = artifacts.require('AccountIngress.sol');
const RulesContract = artifacts.require('AccountRules.sol');
const AdminContract = artifacts.require('Admin.sol');
const RulesStorage = artifacts.require('AccountStorage.sol');

// Contract keys
const RULES_NAME = "0x72756c6573000000000000000000000000000000000000000000000000000000";
const ADMIN_NAME = "0x61646d696e697374726174696f6e000000000000000000000000000000000000";

var address1 = "0xde3422671d38ecdd7a75702db7f54d4b30c022ea";
var address2 = "0x470f4787c58eeec8be0282e1cdf7534b1a095201";
var address3 = "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73";
var address4 = "0xc8381e432a2840308697029c23bb0a2d81563b94";

const newAdmin = "f17f52151EbEF6C7334FAD080c5704D77216b732";

var txValue = 12345;
var txGasLimit = 3000;
var txGasPrice = 1200;
var txPayload = "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73";

contract("Account Rules (Permissioning)", (accounts) => {
  let ingressContract;
  let rulesContract;
  let adminContract;
  let storageContract;

  before(async () => {
    ingressContract = await IngressContract.new();

    adminContract = await AdminContract.new();
    await ingressContract.setContractAddress(ADMIN_NAME, adminContract.address);

    // initialize the storage
    storageContract = await RulesStorage.new(ingressContract.address);
    console.log("   >>> Storage contract deployed with address = " + storageContract.address);

    // set rules -> storage
    rulesContract = await RulesContract.new(ingressContract.address, storageContract.address);

    // set storage -> rules
    await storageContract.upgradeVersion(rulesContract.address);
    console.log("   >>> Set storage owner to Rules.address " + rulesContract.address);

    await ingressContract.setContractAddress(RULES_NAME, rulesContract.address);
    // TODO this is duplicated in event test file
    // assert initial state
    let size = await rulesContract.getSize();
    assert.equal(size, 1, "Allowlist initializes with 1 account");
    let initialAccount = await rulesContract.getByIndex(0);
    assert.equal(initialAccount, accounts[0], "Allowlist initializes allowing deploying account");
    await rulesContract.removeAccount(initialAccount);
  });

  it('should NOT permit account when allowlist is empty', async () => {
    let size = await rulesContract.getSize();
    assert.equal(size, 0, "expected empty allowlist");

    let permitted = await rulesContract.accountPermitted(address1);
    assert.notOk(permitted, 'expected node NOT permitted');
  });

  it('Should NOT fail when removing account from empty list', async () => {
    let size = await rulesContract.getSize();
    assert.equal(size, 0, "expected empty allowlist");

    let tx = await rulesContract.removeAccount(address1);
    assert.ok(tx.receipt.status);
  });

  it('should add multiple accounts to allowlist', async () => {
    await rulesContract.addAccount(address1);
    await rulesContract.addAccount(address2);
    await rulesContract.addAccount(address3);

    permitted = await rulesContract.accountPermitted(address1);
    assert.ok(permitted, 'expected account 1 added to be in allowlist');

    permitted = await rulesContract.accountPermitted(address2);
    assert.ok(permitted, 'expected account 2 added to be in allowlist');

    permitted = await rulesContract.accountPermitted(address3);
    assert.ok(permitted, 'expected account 3 added to be in allowlist');
  });

  it("getByIndex returns expected order", async () => {
    let result = await rulesContract.getByIndex(0);
    assert.equal(result.toLowerCase(), address1.toLowerCase());

    result = await rulesContract.getByIndex(1);
    assert.equal(result.toLowerCase(), address2.toLowerCase());

    result = await rulesContract.getByIndex(2);
    assert.equal(result.toLowerCase(), address3.toLowerCase());
  });

  it('should allow a transaction from account added to the allowlist', async () => {
    let permitted = await rulesContract.transactionAllowed(address1, address2, txValue, txGasPrice, txGasLimit, txPayload);
    assert.equal(permitted, true, 'expected permitted address1');

    permitted = await rulesContract.transactionAllowed(address2, address1, txValue, txGasPrice, txGasLimit, txPayload);
    assert.equal(permitted, true, 'expected permitted address2');
  });

  it('should NOT allow transaction from account removed from allowlist', async () => {
    await rulesContract.removeAccount(address3);
    let permitted = await rulesContract.accountPermitted(address3);
    assert.notOk(permitted, 'expected removed account NOT permitted');

    permitted = await rulesContract.transactionAllowed(address3, address1, txValue, txGasPrice, txGasLimit, txPayload);
    assert.equal(permitted, false, 'expected source disallowed since it was removed');

    let result = await rulesContract.getSize();
    assert.equal(result, 2, "expected number of nodes");
  });

  it('should permit an account added back to the allowlist', async () => {
    let permitted = await rulesContract.accountPermitted(address3);
    assert.notOk(permitted, 'expected removed account NOT permitted');

    await rulesContract.addAccount(address3);
    permitted = await rulesContract.accountPermitted(address3);
    assert.ok(permitted, 'expected added account permitted');

    permitted = await rulesContract.transactionAllowed(address3, address2, txValue, txGasPrice, txGasLimit, txPayload);
    assert.equal(permitted, true, 'expected transaction allowed since account was added back to allowlist');
  });

  it('should not allow non-admin account to add to allowlist', async () => {
    try {
      await rulesContract.addAccount(address1, { from: accounts[1] });
      expect.fail(null, null, "Modifier was not enforced")
    } catch(err) {
      expect(err.reason).to.contain('Sender not authorized');
    }
  });

  it('should not allow non-admin account to remove from allowlist', async () => {
    try {
      await rulesContract.removeAccount(address1, { from: accounts[1] });
      expect.fail(null, null, "Modifier was not enforced")
    } catch(err) {
      expect(err.reason).to.contain('Sender not authorized');
    }
  });

  it('should allow new admin account to remove from allowlist', async () => {
    await adminContract.addAdmin(accounts[1]);

    await rulesContract.removeAccount(address1, { from: accounts[1] });

    let permitted = await rulesContract.accountPermitted(address1);
    assert.notOk(permitted, 'expected added node NOT permitted');
  });

  it('should allow new admin account to add to allowlist', async () => {
    await adminContract.addAdmin(accounts[2]);

    await rulesContract.addAccount(address1, { from: accounts[2] });

    let permitted = await rulesContract.accountPermitted(address1);
    assert.ok(permitted, 'expected added account permitted');
  });

  it('should allow transactions from an admin account that is not on the allow list', async () => {
    await adminContract.addAdmin(address4);

    let permitted = await rulesContract.accountPermitted(address4);
    assert.notOk(permitted, 'expected account not permitted since it is not on the allow list');

    permitted = await rulesContract.transactionAllowed(address4, address2, txValue, txGasPrice, txGasLimit, txPayload);
    assert.ok(permitted, 'expected transaction allowed since account is an admin');
  });
});
