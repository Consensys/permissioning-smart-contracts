const IngressContract = artifacts.require('Ingress.sol');
const RulesContract = artifacts.require('AccountRules.sol');
const AdminContract = artifacts.require('Admin.sol');

// Contract keys
const RULES_NAME = "0x72756c6573000000000000000000000000000000000000000000000000000000";
const ADMIN_NAME = "0x61646d696e697374726174696f6e000000000000000000000000000000000000";

var address1 = "0xdE3422671D38EcdD7A75702Db7f54d4b30C022Ea".toLowerCase();
var address2 = "0x470f4787c58EEec8be0282e1Cdf7534b1A095201".toLowerCase();
var address3 = "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73".toLowerCase();

const newAdmin = "f17f52151EbEF6C7334FAD080c5704D77216b732";

var txValue = 12345;
var txGasLimit = 3000;
var txGasPrice = 1200;
var txPayload = "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73";

contract("Account Rules (Permissioning)", (accounts) => {
  let ingressContract;
  let rulesContract;
  let adminContract;

  before(async () => {
    ingressContract = await IngressContract.new();

    adminContract = await AdminContract.new();
    await ingressContract.setContractAddress(ADMIN_NAME, adminContract.address);

    rulesContract = await RulesContract.new(ingressContract.address);
    await ingressContract.setContractAddress(RULES_NAME, rulesContract.address);
  });

  it('should NOT permit account when whitelist is empty', async () => {
    let size = await rulesContract.getSize();
    assert.equal(size, 0, "expected empty whitelist");

    let permitted = await rulesContract.accountInWhitelist(address1);
    assert.notOk(permitted, 'expected node NOT permitted');
  });

  it('Should NOT fail when removing account from empty list', async () => {
    let size = await rulesContract.getSize();
    assert.equal(size, 0, "expected empty whitelist");

    let tx = await rulesContract.removeAccount(address1);
    assert.ok(tx.receipt.status);
  });

  it('should add multiple accounts to whitelist', async () => {
    await rulesContract.addAccount(address1);
    await rulesContract.addAccount(address2);
    await rulesContract.addAccount(address3);

    permitted = await rulesContract.accountInWhitelist(address1);
    assert.ok(permitted, 'expected account 1 added to be in whitelist');

    permitted = await rulesContract.accountInWhitelist(address2);
    assert.ok(permitted, 'expected account 2 added to be in whitelist');

    permitted = await rulesContract.accountInWhitelist(address3);
    assert.ok(permitted, 'expected account 3 added to be in whitelist');
  });

  it("getByIndex returns expected order", async () => {
    let result = await rulesContract.getByIndex(0);
    assert.equal(result.toLowerCase(), address1.toLowerCase());

    result = await rulesContract.getByIndex(1);
    assert.equal(result.toLowerCase(), address2.toLowerCase());

    result = await rulesContract.getByIndex(2);
    assert.equal(result.toLowerCase(), address3.toLowerCase());
  });

  it('should allow a transaction from account added to the whitelist', async () => {
    let permitted = await rulesContract.transactionAllowed(address1, address2, txValue, txGasPrice, txGasLimit, txPayload);
    assert.equal(permitted, true, 'expected permitted address1');

    permitted = await rulesContract.transactionAllowed(address2, address1, txValue, txGasPrice, txGasLimit, txPayload);
    assert.equal(permitted, true, 'expected permitted address2');
  });

  it('should NOT allow transaction from account removed from whitelist', async () => {
    await rulesContract.removeAccount(address3);
    let permitted = await rulesContract.accountInWhitelist(address3);
    assert.notOk(permitted, 'expected removed account NOT permitted');

    permitted = await rulesContract.transactionAllowed(address3, address1, txValue, txGasPrice, txGasLimit, txPayload);
    assert.equal(permitted, false, 'expected source disallowed since it was removed');

    let result = await rulesContract.getSize();
    assert.equal(result, 2, "expected number of nodes");
  });

  it('should permit an account added back to the whitelist', async () => {
    let permitted = await rulesContract.accountInWhitelist(address3);
    assert.notOk(permitted, 'expected removed account NOT permitted');

    await rulesContract.addAccount(address3);
    permitted = await rulesContract.accountInWhitelist(address3);
    assert.ok(permitted, 'expected added account permitted');

    permitted = await rulesContract.transactionAllowed(address3, address2, txValue, txGasPrice, txGasLimit, txPayload);
    assert.equal(permitted, true, 'expected transaction allowed since account was added back to whitelist');
  });

  it('should not allow non-admin account to add to whitelist', async () => {
    try {
      await rulesContract.addAccount(address1, { from: accounts[1] });
      expect.fail(null, null, "Modifier was not enforced")
    } catch(err) {
      expect(err.reason).to.contain('Sender not authorized');
    }
  });

  it('should not allow non-admin account to remove from whitelist', async () => {
    try {
      await rulesContract.addAccount(address1, { from: accounts[1] });
      expect.fail(null, null, "Modifier was not enforced")
    } catch(err) {
      expect(err.reason).to.contain('Sender not authorized');
    }
  });

  it('should allow new admin account to remove from whitelist', async () => {
    await adminContract.addAdmin(accounts[1]);

    await rulesContract.removeAccount(address1, { from: accounts[1] });

    let permitted = await rulesContract.accountInWhitelist(address1);
    assert.notOk(permitted, 'expected added node NOT permitted');
  });

  it('should allow new admin account to add to whitelist', async () => {
    await adminContract.addAdmin(accounts[2]);

    await rulesContract.addAccount(address1, { from: accounts[2] });

    let permitted = await rulesContract.accountInWhitelist(address1);
    assert.ok(permitted, 'expected added account permitted');
  });
});
