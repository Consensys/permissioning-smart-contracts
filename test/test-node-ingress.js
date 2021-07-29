const NodeIngressContract = artifacts.require("NodeIngress.sol");
const NodeRules = artifacts.require("NodeRules.sol");
const AdminContract = artifacts.require("Admin.sol");
const RulesStorage = artifacts.require('NodeStorage.sol');

const RULES="0x72756c6573000000000000000000000000000000000000000000000000000000";
const ADMIN="0x61646d696e697374726174696f6e000000000000000000000000000000000000";

var enodeId = "9bd359fdc3a2ed5df436c3d8914b1532740128929892092b7fcb320c1b62f375"
+ "892092b7fcb320c1b62f3759bd359fdc3a2ed5df436c3d8914b1532740128929";
var nodeHost = "localhost";
var nodePort = 30303;

const address2 = "0x345ca3e014aaf5dca488057592ee47305d9b3e10".toLowerCase();

contract ("Node Ingress (no contracts registered)", (accounts) => {
    let nodeIngressContract;
    let nodeRulesContract;
    let adminContract;
    let storageContract;

    beforeEach("create a new contract for each test", async () => {
        nodeIngressContract = await NodeIngressContract.new();
        adminContract = await AdminContract.new();

        // set the storage
        storageContract = await RulesStorage.new(nodeIngressContract.address);
        console.log("   >>> Storage contract deployed with address = " + storageContract.address);
        
        nodeRulesContract = await NodeRules.new(nodeIngressContract.address, storageContract.address);
        })

    it("should forbid any connection if rules contract has not been registered", async () => {
        result = await nodeIngressContract.getContractAddress(RULES);
        assert.equal(result, "0x0000000000000000000000000000000000000000", "NodeRules contract should NOT be registered");

        let permitted = await nodeIngressContract.connectionAllowed(enodeId, nodeHost, nodePort);
        assert.equal(permitted, false, "expected connectionAllowed to return false");
    });

    it("Should return empty value if NodeRules contract has not been registered", async () => {
        let result = await nodeIngressContract.getContractAddress(RULES);
        assert.equal(result, "0x0000000000000000000000000000000000000000", "NodeRules contract should NOT already be registered");
    });

    it("Should return empty value if Admin contract has not been registered", async () => {
        let result = await nodeIngressContract.getContractAddress(ADMIN);
        assert.equal(result, "0x0000000000000000000000000000000000000000", "Admin contract should NOT already be registered");
    });
    
    it("Should not register zero address contract", async () => {

        // Attempt to register zero address contract
        try {
            await nodeIngressContract.setContractAddress(RULES, "0x0000000000000000000000000000000000000000");
            assert.fail("Should not allow address(0) Contract in registry");
        } catch (err) {
            expect(err.reason).to.contain("Contract address must not be zero");
        }
    });

    it("Should register contract successfully", async () => {
        // Verify that the NodeRules contract has not yet been registered
        let result = await nodeIngressContract.getContractAddress(RULES);
        assert.equal(result, "0x0000000000000000000000000000000000000000", "NodeRules contract should NOT already be registered");

        // Register the NodeRules contract
        result = await nodeIngressContract.setContractAddress(RULES, nodeRulesContract.address);

        // assert values in the RegistryUpdated event
        assert.equal(result.logs[0].args[0], nodeRulesContract.address, "Event address SHOULD be correct");
        assert.equal(result.logs[0].args[1], RULES, "Event name SHOULD be correct");

        // Verify the NodeRules contract address
        result = await nodeIngressContract.getContractAddress(RULES);
        assert.equal(result, nodeRulesContract.address, "NodeRules contract address SHOULD be correct");
    });

      it("Should return all registered contracts", async () => {
        // Register a NodeRules contract
        let result = await nodeIngressContract.setContractAddress(RULES, nodeRulesContract.address);

        // assert values in the RegistryUpdated event
        assert.equal(result.logs[0].args[0], nodeRulesContract.address, "Event address SHOULD be correct");
        assert.equal(result.logs[0].args[1], RULES, "Event name SHOULD be correct");

        // Register an "Admin" contract
        result = await nodeIngressContract.setContractAddress(ADMIN, adminContract.address);

        // assert values in the RegistryUpdated event
        assert.equal(result.logs[0].args[0], adminContract.address, "Event address SHOULD be correct");
        assert.equal(result.logs[0].args[1], ADMIN, "Event name SHOULD be correct");

        result = await nodeIngressContract.getAllContractKeys();

        assert.equal(result[0], RULES, "NodeRules contract SHOULD be registered");
        assert.equal(result[1], ADMIN, "Admin contract SHOULD be registered");
      });

      it("Should delete a specified contract", async () => {
        // Verify that the NodeRules contract has not yet been registered
        let result = await nodeIngressContract.getContractAddress(RULES);
        assert.equal(result, "0x0000000000000000000000000000000000000000", "NodeRules contract should NOT already be registered");

        // Register the NodeRules contract
        result = await nodeIngressContract.setContractAddress(RULES, nodeRulesContract.address);

        // Verify the NodeRules contract address
        result = await nodeIngressContract.getContractAddress(RULES);
        assert.equal(result, nodeRulesContract.address, "NodeRules contract address SHOULD be correct");

        // Verify correct number of Contracts
        result = await nodeIngressContract.getAllContractKeys();
        assert.equal(result.length, 1, "1 key SHOULD be registered");

        // Delete the NodeRules contract
        result = await nodeIngressContract.removeContract(RULES);

        // assert values in the RegistryUpdated event
        assert.equal(result.logs[0].args[0], 0, "Event address from REMOVE SHOULD be zero");
        assert.equal(result.logs[0].args[1], RULES, "Event name SHOULD be correct");

        // Verify that the NodeRules contract has been deleted
        result = await nodeIngressContract.getContractAddress(RULES);
        assert.equal(result, "0x0000000000000000000000000000000000000000", "NodeRules contract SHOULD have been deleted");

        // Verify correct number of Contracts
        result = await nodeIngressContract.getAllContractKeys();
        assert.equal(result.length, 0, "0 keys SHOULD be registered");
    });

    it('Should update a specified contract', async () => {
        let result;

         // Verify that the NodeRules contract has not yet been registered
        result = await nodeIngressContract.getContractAddress(RULES);
        assert.equal(result, "0x0000000000000000000000000000000000000000", 'NodeRules contract should NOT already be registered');

         // Register the NodeRules contract
        result = await nodeIngressContract.setContractAddress(RULES, nodeRulesContract.address);

         // Verify the NodeRules contract address
        result = await nodeIngressContract.getContractAddress(RULES);
        assert.equal(result, nodeRulesContract.address, 'NodeRules contract address SHOULD be correct');

         // Verify correct number of Contracts
        result = await nodeIngressContract.getAllContractKeys();
        assert.equal(result.length, 1, '1 key SHOULD be registered');

         // Update the NodeRules contract
        result = await nodeIngressContract.setContractAddress(RULES, address2);

         // assert values in the RegistryUpdated event
        assert.equal(result.logs[0].args[0].toLowerCase(), address2, 'Event address from REMOVE SHOULD be zero');
        assert.equal(result.logs[0].args[1], RULES, 'Event name SHOULD be correct');

         // Verify that the NodeRules contract has been deleted
        result = await nodeIngressContract.getContractAddress(RULES);
        assert.equal(result.toLowerCase(), address2, 'NodeRules contract SHOULD have been updated');

         // Verify correct number of Contracts
        result = await nodeIngressContract.getAllContractKeys();
        assert.equal(result.length, 1, '1 keys SHOULD be registered');
    });
});

contract("Ingress contract", (accounts) => {
    let nodeIngressContract;
    let nodeRulesContract;
    let adminContract;
    let storageContract;

    beforeEach("Setup contract registry", async () => {
        nodeIngressContract = await NodeIngressContract.new();
        adminContract = await AdminContract.new();
        await nodeIngressContract.setContractAddress(ADMIN, adminContract.address);

        // set the storage
        storageContract = await RulesStorage.new(nodeIngressContract.address);
        console.log("   >>> Storage contract deployed with address = " + storageContract.address);
        
        nodeRulesContract = await NodeRules.new(nodeIngressContract.address, storageContract.address);
    
        await nodeIngressContract.setContractAddress(RULES, nodeRulesContract.address);
        // set rules as the storage owner
        await storageContract.upgradeVersion(nodeRulesContract.address);
        console.log("   >>> Set storage owner to Rules.address");
    })

    it("Should not allow an unauthorized account to perform administration operations", async () => {
        // Verify account 1 is not authorized
        let result = await nodeIngressContract.isAuthorized(accounts[1]);
        assert.equal(result, false, "Sender account should NOT be authorized");

        // Attempt to register an additional contract
        try {
            await nodeIngressContract.setContractAddress(RULES, nodeRulesContract.address, { from: accounts[1] });
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

        // try to remove non existent contract. should have no effect
        await nodeIngressContract.removeContract(CONTRACT_NAME);

        // Register the NodeRules contract
        await nodeIngressContract.setContractAddress(CONTRACT_NAME, CONTRACT_ADDR);

        // Verify the NodeRules contract is registered
        result = await nodeIngressContract.getContractAddress(CONTRACT_NAME);
        assert.equal(result, CONTRACT_ADDR, "Contract SHOULD be registered");

        // Verify correct number of Contracts
        result = await nodeIngressContract.getAllContractKeys();
        assert.equal(result.length, 3, "3 keys SHOULD be registered");

        // Remove the NodeRules contract ie not the last one
        await nodeIngressContract.removeContract(RULES);

        // Verify that the NodeRules contract has been removed
        result = await nodeIngressContract.getContractAddress(RULES);
        assert.equal(result, "0x0000000000000000000000000000000000000000", "Contract should NOT be registered");

        // Verify correct number of Contracts
        result = await nodeIngressContract.getAllContractKeys();
        assert.equal(result.length, 2, "2 keys SHOULD be registered");
        result = await nodeIngressContract.getSize();
        assert.equal(result, 2, "2 keys SHOULD be registered");

        // Remove the new contract
        await nodeIngressContract.removeContract(CONTRACT_NAME);

        // Verify that the new contract has been removed
        result = await nodeIngressContract.getContractAddress(CONTRACT_NAME);
        assert.equal(result, "0x0000000000000000000000000000000000000000", "Contract should NOT be registered");

        // Verify correct number of Contracts
        result = await nodeIngressContract.getAllContractKeys();
        assert.equal(result.length, 1, "1 keys SHOULD be registered");
    });

    it("Should emit an event when the NodeRules are updated", async () => {
        //Add a more restrictive rule
        await nodeRulesContract.addEnode(enodeId, nodeHost, nodePort, { from: accounts[0] });

        // Get the events
        let result = await nodeIngressContract.getPastEvents("NodePermissionsUpdated", {fromBlock: 0, toBlock: "latest" });

        // Verify the NodePermissionsUpdated event
        assert.equal(result[0].returnValues.addsRestrictions, false, "addsRestrictions SHOULD be false");

        // Add a less restrictive rule
        result = await nodeRulesContract.removeEnode(enodeId, nodeHost, nodePort);

        // Get the events
        result = await nodeIngressContract.getPastEvents("NodePermissionsUpdated", {fromBlock: 0, toBlock: "latest" });

        // Verify the NodePermissionsUpdated event
        assert.equal(result[1].returnValues.addsRestrictions, true, "addsRestrictions SHOULD be true");
    });

    it("Should only trigger NodeRules update events when issued from NodeRules contract", async () => {
        let result;

        const acProxy = await NodeRules.new(nodeIngressContract.address, storageContract.address);

        // Register the contracts
        await nodeIngressContract.setContractAddress(RULES, nodeRulesContract.address);
        await nodeIngressContract.setContractAddress(ADMIN, acProxy.address);

        // Verify the contract addresses
        result = await nodeIngressContract.getContractAddress(RULES);
        assert.equal(result, nodeRulesContract.address, "NodeRules contract address SHOULD be correct");
        result = await nodeIngressContract.getContractAddress(ADMIN);
        assert.equal(result, acProxy.address, "Admin contract address SHOULD be correct");

        // Verify correct number of Contracts
        result = await nodeIngressContract.getAllContractKeys();
        assert.equal(result.length, 2, "2 keys SHOULD be registered");

        // Trigger an event from NodeRules contract
        await nodeRulesContract.triggerRulesChangeEvent(true);

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
