const NodeIngressContract = artifacts.require("NodeIngress.sol");
const RulesContract = artifacts.require("Rules.sol");
const AdminContract = artifacts.require("Admin.sol");

const RULES="0x72756c6573000000000000000000000000000000000000000000000000000000";
const ADMIN="0x61646d696e697374726174696f6e000000000000000000000000000000000000";

var nodeHigh = "0x9bd359fdc3a2ed5df436c3d8914b1532740128929892092b7fcb320c1b62f375";
var nodeLow = "0x892092b7fcb320c1b62f3759bd359fdc3a2ed5df436c3d8914b1532740128929";
var nodeHost = "0x0000000000000000000011119bd359fd";
var nodePort = 30303;

var node2High = "0x892092b7fcb320c1b62f3759bd359fdc3a2ed5df436c3d8914b1532740128929";
var node2Low = "0xcb320c1b62f37892092b7f59bd359fdc3a2ed5df436c3d8914b1532740128929";
var node2Host = "0x0000000000000000000011119bd359fd";
var node2Port = 30304;

const address2 = "0x345ca3e014aaf5dca488057592ee47305d9b3e10".toLowerCase();

contract ("Node Ingress (no contracts registered)", (accounts) => {
    let nodeIngressContract;
    let rulesContract;
    let adminContract;

    beforeEach("create a new contract for each test", async () => {
        nodeIngressContract = await NodeIngressContract.new();
        adminContract = await AdminContract.new();
        rulesContract = await RulesContract.new(nodeIngressContract.address);
    })

    it("should forbid any connection if rules contract has not been registered", async () => {
        result = await nodeIngressContract.getContractAddress(RULES);
        assert.equal(result, "0x0000000000000000000000000000000000000000", "Rules contract should NOT be registered");

        let permitted = await nodeIngressContract.connectionAllowed(nodeHigh, nodeLow, nodeHost, nodePort, node2High, node2Low, node2Host, node2Port);
        assert.equal(permitted, "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", "expected connectionAllowed to return false");
    });

    it("Should return empty value if Rules contract has not been registered", async () => {
        let result = await nodeIngressContract.getContractAddress(RULES);
        assert.equal(result, "0x0000000000000000000000000000000000000000", "Rules contract should NOT already be registered");
    });

    it("Should return empty value if Admin contract has not been registered", async () => {
        let result = await nodeIngressContract.getContractAddress(ADMIN);
        assert.equal(result, "0x0000000000000000000000000000000000000000", "Admin contract should NOT already be registered");
    });

    it("Should register contract successfully", async () => {
        // Verify that the Rules contract has not yet been registered
        let result = await nodeIngressContract.getContractAddress(RULES);
        assert.equal(result, "0x0000000000000000000000000000000000000000", "Rules contract should NOT already be registered");

        // Register the Rules contract
        result = await nodeIngressContract.setContractAddress(RULES, rulesContract.address);

        // assert values in the RegistryUpdated event
        assert.equal(result.logs[0].args[0], rulesContract.address, "Event address SHOULD be correct");
        assert.equal(result.logs[0].args[1], RULES, "Event name SHOULD be correct");

        // Verify the Rules contract address
        result = await nodeIngressContract.getContractAddress(RULES);
        assert.equal(result, rulesContract.address, "Rules contract address SHOULD be correct");
    });

      it("Should return all registered contracts", async () => {
        // Register a Rules contract
        let result = await nodeIngressContract.setContractAddress(RULES, rulesContract.address);

        // assert values in the RegistryUpdated event
        assert.equal(result.logs[0].args[0], rulesContract.address, "Event address SHOULD be correct");
        assert.equal(result.logs[0].args[1], RULES, "Event name SHOULD be correct");

        // Register an "Admin" contract
        result = await nodeIngressContract.setContractAddress(ADMIN, adminContract.address);

        // assert values in the RegistryUpdated event
        assert.equal(result.logs[0].args[0], adminContract.address, "Event address SHOULD be correct");
        assert.equal(result.logs[0].args[1], ADMIN, "Event name SHOULD be correct");

        result = await nodeIngressContract.getAllContractKeys();

        assert.equal(result[0], RULES, "Rules contract SHOULD be registered");
        assert.equal(result[1], ADMIN, "Admin contract SHOULD be registered");
      });

      it("Should delete a specified contract", async () => {
        // Verify that the Rules contract has not yet been registered
        let result = await nodeIngressContract.getContractAddress(RULES);
        assert.equal(result, "0x0000000000000000000000000000000000000000", "Rules contract should NOT already be registered");

        // Register the Rules contract
        result = await nodeIngressContract.setContractAddress(RULES, rulesContract.address);

        // Verify the Rules contract address
        result = await nodeIngressContract.getContractAddress(RULES);
        assert.equal(result, rulesContract.address, "Rules contract address SHOULD be correct");

        // Verify correct number of Contracts
        result = await nodeIngressContract.getAllContractKeys();
        assert.equal(result.length, 1, "1 key SHOULD be registered");

        // Delete the Rules contract
        result = await nodeIngressContract.removeContract(RULES);

        // assert values in the RegistryUpdated event
        assert.equal(result.logs[0].args[0], 0, "Event address from REMOVE SHOULD be zero");
        assert.equal(result.logs[0].args[1], RULES, "Event name SHOULD be correct");

        // Verify that the Rules contract has been deleted
        result = await nodeIngressContract.getContractAddress(RULES);
        assert.equal(result, "0x0000000000000000000000000000000000000000", "Rules contract SHOULD have been deleted");

        // Verify correct number of Contracts
        result = await nodeIngressContract.getAllContractKeys();
        assert.equal(result.length, 0, "0 keys SHOULD be registered");
    });

    it('Should update a specified contract', async () => {
        let result;

         // Verify that the Rules contract has not yet been registered
        result = await nodeIngressContract.getContractAddress(RULES);
        assert.equal(result, "0x0000000000000000000000000000000000000000", 'Rules contract should NOT already be registered');

         // Register the Rules contract
        result = await nodeIngressContract.setContractAddress(RULES, rulesContract.address);

         // Verify the Rules contract address
        result = await nodeIngressContract.getContractAddress(RULES);
        assert.equal(result, rulesContract.address, 'Rules contract address SHOULD be correct');

         // Verify correct number of Contracts
        result = await nodeIngressContract.getAllContractKeys();
        assert.equal(result.length, 1, '1 key SHOULD be registered');

         // Update the Rules contract
        result = await nodeIngressContract.setContractAddress(RULES, address2);

         // assert values in the RegistryUpdated event
        assert.equal(result.logs[0].args[0].toLowerCase(), address2, 'Event address from REMOVE SHOULD be zero');
        assert.equal(result.logs[0].args[1], RULES, 'Event name SHOULD be correct');

         // Verify that the Rules contract has been deleted
        result = await nodeIngressContract.getContractAddress(RULES);
        assert.equal(result.toLowerCase(), address2, 'Rules contract SHOULD have been updated');

         // Verify correct number of Contracts
        result = await nodeIngressContract.getAllContractKeys();
        assert.equal(result.length, 1, '1 keys SHOULD be registered');
    });
});

contract("Ingress contract", (accounts) => {
    let nodeIngressContract;
    let rulesContract;
    let adminContract;

    beforeEach("Setup contract registry", async () => {
        nodeIngressContract = await NodeIngressContract.new();
        adminContract = await AdminContract.new();
        await nodeIngressContract.setContractAddress(ADMIN, adminContract.address);
        rulesContract = await RulesContract.new(nodeIngressContract.address);
        await nodeIngressContract.setContractAddress(RULES, rulesContract.address);
    })

    it("Should not allow an unauthorized account to perform administration operations", async () => {
        // Verify account 1 is not authorized
        let result = await nodeIngressContract.isAuthorized(accounts[1]);
        assert.equal(result, false, "Sender account should NOT be authorized");

        // Attempt to register an additional contract
        try {
            await nodeIngressContract.setContractAddress(RULES, rulesContract.address, { from: accounts[1] });
            assert.fail("Unauthorized sender was able to set Contract in registry");
        } catch (err) {
            expect(err.reason).to.contain("Not authorized to update contract registry");
        }

        // Attempt to remove the Admin contract
        try {
            await nodeIngressContract.removeContract(ADMIN, { from: accounts[1] });
            assert.fail("Unauthorized sender was able to remove Contract in registry");
        } catch (err) {
            expect(err.reason).to.contain("Not authorized to update contract registry");
        }
    });

    it("Should allow authorized account to perform administration operations", async () => {
        const CONTRACT_NAME="0x666f6f0000000000000000000000000000000000000000000000000000000000";
        const CONTRACT_ADDR="0x1111111111111111111111111111111111111111";

        // Verify sender is initially authorized
        let result = await nodeIngressContract.isAuthorized(accounts[0]);
        assert.equal(result, true, "Sender account SHOULD be authorized");

        // Register the Rules contract
        await nodeIngressContract.setContractAddress(CONTRACT_NAME, CONTRACT_ADDR);

        // Verify the Rules contract is registered
        result = await nodeIngressContract.getContractAddress(CONTRACT_NAME);
        assert.equal(result, CONTRACT_ADDR, "Contract SHOULD be registered");

        // Verify correct number of Contracts
        result = await nodeIngressContract.getAllContractKeys();
        assert.equal(result.length, 3, "3 keys SHOULD be registered");

        // Remove the Rules contract
        await nodeIngressContract.removeContract(CONTRACT_NAME);

        // Verify that the Rules contract has been removed
        result = await nodeIngressContract.getContractAddress(CONTRACT_NAME);
        assert.equal(result, "0x0000000000000000000000000000000000000000", "Contract should NOT be registered");

        // Verify correct number of Contracts
        result = await nodeIngressContract.getAllContractKeys();
        assert.equal(result.length, 2, "2 keys SHOULD be registered");
    });

    it("Should emit an event when the Rules are updated", async () => {
        //Add a more restrictive rule
        await rulesContract.addEnode(nodeHigh, nodeLow, nodeHost, nodePort, { from: accounts[0] });

        // Get the events
        let result = await nodeIngressContract.getPastEvents("NodePermissionsUpdated", {fromBlock: 0, toBlock: "latest" });

        // Verify the NodePermissionsUpdated event
        assert.equal(result[0].returnValues.addsRestrictions, false, "addsRestrictions SHOULD be false");

        // Add a less restrictive rule
        result = await rulesContract.removeEnode(nodeHigh, nodeLow, nodeHost, nodePort);

        // Get the events
        result = await nodeIngressContract.getPastEvents("NodePermissionsUpdated", {fromBlock: 0, toBlock: "latest" });

        // Verify the NodePermissionsUpdated event
        assert.equal(result[1].returnValues.addsRestrictions, true, "addsRestrictions SHOULD be true");
    });

    it("Should only trigger Rules update events when issued from Rules contract", async () => {
        let result;

        const acProxy = await RulesContract.new(nodeIngressContract.address);

        // Register the contracts
        await nodeIngressContract.setContractAddress(RULES, rulesContract.address);
        await nodeIngressContract.setContractAddress(ADMIN, acProxy.address);

        // Verify the contract addresses
        result = await nodeIngressContract.getContractAddress(RULES);
        assert.equal(result, rulesContract.address, "Rules contract address SHOULD be correct");
        result = await nodeIngressContract.getContractAddress(ADMIN);
        assert.equal(result, acProxy.address, "Admin contract address SHOULD be correct");

        // Verify correct number of Contracts
        result = await nodeIngressContract.getAllContractKeys();
        assert.equal(result.length, 2, "2 keys SHOULD be registered");

        // Trigger an event from Rules contract
        await rulesContract.triggerRulesChangeEvent(true);

        // Get the events
        result = await nodeIngressContract.getPastEvents("NodePermissionsUpdated", {fromBlock: 0, toBlock: "latest" });

        // Verify the NodePermissionsUpdated event
        assert.equal(result.length, 1, "Number of events SHOULD be 1");

        // Attempt to trigger an additional event from Admin contract
        try {
            await acProxy.triggerRulesChangeEvent(true);
            assert.fail("Unauthorized contract was allowed to trigger event")
        } catch (err) {
            assert.isOk(err.toString().includes("revert"), "Expected revert in message");
        }

        // Get the events
        result = await nodeIngressContract.getPastEvents("NodePermissionsUpdated", {fromBlock: 0, toBlock: "latest" });

        // Verify the NodePermissionsUpdated event
        assert.equal(result.length, 1, "Number of events SHOULD be 1");
    });
});