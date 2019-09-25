const AccountIngress = artifacts.require('AccountIngress.sol');
const AccountRules = artifacts.require('AccountRules.sol');
const Admin = artifacts.require('Admin.sol');

const RULES='0x72756c6573000000000000000000000000000000000000000000000000000000';
const ADMIN='0x61646d696e697374726174696f6e000000000000000000000000000000000000';

var address1 = "0xdE3422671D38EcdD7A75702Db7f54d4b30C022Ea".toLowerCase();
var address2 = "0xf17f52151EbEF6C7334FAD080c5704D77216b732".toLowerCase();

contract ('AccountIngress (proxying permissioning check to rules contract)', () => {

  let accountIngressContract;
  let accountRulesContract;
  let adminContract;

  beforeEach(async () => {
    accountIngressContract = await AccountIngress.new();
    adminContract = await Admin.new();
    
    await accountIngressContract.setContractAddress(ADMIN, adminContract.address);
    accountRulesContract = await AccountRules.new(accountIngressContract.address);

    result = await accountIngressContract.getContractAddress(ADMIN);
    assert.equal(result, adminContract.address, 'Admin contract should be reg');
  });

  it('Should execute proxied call correctly', async () => {
    let result;
    let result2;

    await accountIngressContract.setContractAddress(RULES, accountRulesContract.address);

    result = await accountIngressContract.getContractAddress(ADMIN);
    assert.equal(result, adminContract.address, 'Admin contract should be reg');

    // Verify that the AccountRules contract has been registered
    result = await accountIngressContract.getContractAddress(RULES);
    assert.equal(result, accountRulesContract.address, 'AccountRules contract should be reg');

    // Verify that the nodes are not permitted to talk
    result2 = await accountRulesContract.transactionAllowed(address1, address2, 0, 1, 2, RULES);
    result = await accountIngressContract.transactionAllowed(address1, address2, 0, 1, 2, RULES);
    assert.equal(result, false, "Connection should NOT be allowed before Enodes have been registered");
    assert.equal(result, result2, "Call and proxy call did NOT return the same value");

    // Add the two Enodes to the AccountRules register
    result = await accountRulesContract.addAccount(address1);
    result = await accountRulesContract.addAccount(address2);

    // Verify that the nodes are now able to talk
    result2 = await accountRulesContract.transactionAllowed(address1, address2, 0, 1, 2, RULES);
    result = await accountIngressContract.transactionAllowed(address1, address2, 0, 1, 2, RULES);
    assert.equal(result, true, "Connection SHOULD be allowed after Enodes have been registered");
    assert.equal(result, result2, "Call and proxy call did NOT return the same value");
  });

  it('Should permit changing active AccountRules contract addresses', async () => {
    let result;
    let result2;

    // const icProxy = await AccountIngress.new();
    const rcProxy1 = await AccountRules.new(accountIngressContract.address);

    // Verify that the AccountRules contract has not been registered
    result = await accountIngressContract.getContractAddress(RULES);
    assert.equal(result, "0x0000000000000000000000000000000000000000", 'AccountRules contract should NOT already be registered');

    // Register the initial AccountRules contract
    await accountIngressContract.setContractAddress(RULES, rcProxy1.address);

    // Verify the initial rules contract has been registered
    result = await accountIngressContract.getContractAddress(RULES);
    assert.equal(result, rcProxy1.address, 'Initial contract has NOT been registered correctly');

    // Verify that the newly registered contract is the initial version
    let contract = await AccountRules.at(result);
    result = await contract.getContractVersion();
    assert.equal(web3.utils.toDecimal(result), 1000000, 'Initial contract is NOT the correct version');

  });
});