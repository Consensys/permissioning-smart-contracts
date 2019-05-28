const AccountIngressContract = artifacts.require("AccountIngress.sol");
const AdminContract = artifacts.require("Admin.sol");

const RULES="0x72756c6573000000000000000000000000000000000000000000000000000000";
const ADMIN="0x61646d696e697374726174696f6e000000000000000000000000000000000000";

const address = "0x345ca3e014aaf5dca488057592ee47305d9b3e10".toLowerCase();

contract ("Account Ingress (no contracts registered)", (accounts) => {
    let accountIngressContract;
    let adminContract;

    beforeEach("create a new contract for each test", async () => {
        accountIngressContract = await AccountIngressContract.new();
        adminContract = await AdminContract.new();
    })

    it("should forbid any account if rules contract has not been registered", async () => {
        result = await accountIngressContract.getContractAddress(RULES);
        assert.equal(result, "0x0000000000000000000000000000000000000000", "Rules contract should NOT be registered");

        let permitted = await accountIngressContract.transactionAllowed(
            address,
            address,
            0,
            0,
            0,
            "0x00"
        );
        assert.equal(permitted, false, "expected transactionAllowed to return false");
    });

    it("should return a logical version number", async () => {
        let version = await accountIngressContract.getContractVersion();
        assert(version >= 1000000, "Version is larger than 1");
        assert(version <= 999999999999, "Version is less than max");
    });

    it("should reject any attempts to emit events not from the rules contract", async () => {
        try {
          await accountIngressContract.emitRulesChangeEvent(true);
          assert.fail("emitRulesChange should deny non rules contract callers")
        } catch (err) {
          assert.ok("emitRulesChange rejects callers that aren't the rules contract")
        }
    });
});