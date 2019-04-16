const IngressContract = artifacts.require('Ingress.sol');
const RulesContract = artifacts.require('Rules.sol');

const RULES='0x72756c6573000000000000000000000000000000000000000000000000000000';
const ADMIN='0x61646d696e697374726174696f6e000000000000000000000000000000000000';

var nodeHigh = "0x9bd359fdc3a2ed5df436c3d8914b1532740128929892092b7fcb320c1b62f375";
var nodeLow = "0x892092b7fcb320c1b62f3759bd359fdc3a2ed5df436c3d8914b1532740128929";
var nodeHost = "0x0000000000000000000011119bd359fd";
var nodePort = 30303;

var node2High = "0x892092b7fcb320c1b62f3759bd359fdc3a2ed5df436c3d8914b1532740128929";
var node2Low = "0xcb320c1b62f37892092b7f59bd359fdc3a2ed5df436c3d8914b1532740128929";
var node2Host = "0x0000000000000000000011119bd359fd";
var node2Port = 30304;

contract ('Ingress contract', (accounts) => {
    let ingressContract;
    let rulesContract;

    // Reset state before each run
    beforeEach('create a new contract for each test', async () => {
        ingressContract = await IngressContract.new();
        rulesContract = await RulesContract.new(ingressContract.address);
    })

    describe('Ingress contract without Rules address in the registry', () => {
        it('Should forbid every connection while not set up with a Rules address', async () => {
            result = await ingressContract.getContractAddress(RULES);
            assert.equal(result, "0x0000000000000000000000000000000000000000", 'Rules contract should NOT be registered');

            let permitted = await ingressContract.connectionAllowed(nodeHigh, nodeLow, nodeHost, nodePort, node2High, node2Low, node2Host, node2Port);
            assert.equal(permitted, false, 'expected connectionAllowed to return false');
        })
    }),

    describe('Ingress contract should register contract', () => {
        it('Should return empty value if contract not registered', async () => {
          let result;
                    
          // Verify that the Rules contract has not been registered
          result = await ingressContract.getContractAddress(RULES);
          assert.equal(result, "0x0000000000000000000000000000000000000000", 'Rules contract should NOT already be registered');
        });

        it('Should register contract successfully', async () => {
            let result;

            // Verify that the Rules contract has not yet been registered
            result = await ingressContract.getContractAddress(RULES);
            assert.equal(result, "0x0000000000000000000000000000000000000000", 'Rules contract should NOT already be registered');

            // Register the Rules contract
            result = await ingressContract.setContractAddress(RULES, rulesContract.address);

            // assert values in the RegistryUpdated event
            assert.equal(result.logs[0].args[0], rulesContract.address, 'Event address SHOULD be correct');
            assert.equal(result.logs[0].args[1], RULES, 'Event name SHOULD be correct');

            // Verify the Rules contract address
            result = await ingressContract.getContractAddress(RULES);
            assert.equal(result, rulesContract.address, 'Rules contract address SHOULD be correct');
        });

        it('Should return all registered contracts', async () => {
            let result;

            // Register a Rules contract
            result = await ingressContract.setContractAddress(RULES, rulesContract.address);

            // assert values in the RegistryUpdated event
            assert.equal(result.logs[0].args[0], rulesContract.address, 'Event address SHOULD be correct');
            assert.equal(result.logs[0].args[1], RULES, 'Event name SHOULD be correct');
            
            // Register an 'Admin' contract
            result = await ingressContract.setContractAddress(ADMIN, rulesContract.address);

            // assert values in the RegistryUpdated event
            assert.equal(result.logs[0].args[0], rulesContract.address, 'Event address SHOULD be correct');
            assert.equal(result.logs[0].args[1], ADMIN, 'Event name SHOULD be correct');

            result = await ingressContract.getAllContractKeys();
        
            assert.equal(result[0], RULES, 'Rules contract SHOULD be registered');
            assert.equal(result[1], ADMIN, 'Admin contract SHOULD be registered');
        });
    }),
    describe('Ingress contract should delete specified contract', () => {
        it('Should delete a specified contract', async () => {
            let result;
            
            // Verify that the Rules contract has not yet been registered
            result = await ingressContract.getContractAddress(RULES);
            assert.equal(result, "0x0000000000000000000000000000000000000000", 'Rules contract should NOT already be registered');

            // Register the Rules contract
            result = await ingressContract.setContractAddress(RULES, rulesContract.address); 

            // Verify the Rules contract address
            result = await ingressContract.getContractAddress(RULES);
            assert.equal(result, rulesContract.address, 'Rules contract address SHOULD be correct');

            // Verify correct number of Contracts
            result = await ingressContract.getAllContractKeys();
            assert.equal(result.length, 1, '1 key SHOULD be registered');

            // Delete the Rules contract
            result = await ingressContract.removeContract(RULES);

            // assert values in the RegistryUpdated event
            assert.equal(result.logs[0].args[0], 0, 'Event address from REMOVE SHOULD be zero');
            assert.equal(result.logs[0].args[1], RULES, 'Event name SHOULD be correct');

            // Verify that the Rules contract has been deleted
            result = await ingressContract.getContractAddress(RULES);
            assert.equal(result, "0x0000000000000000000000000000000000000000", 'Rules contract SHOULD have been deleted');

            // Verify correct number of Contracts
            result = await ingressContract.getAllContractKeys();
            assert.equal(result.length, 0, '0 keys SHOULD be registered');
        })
    }),

    describe('Ingress contract should enforce Admin authorization', () => {
        it('Should allow an unauthorized account to initially deploy Administration Contract', async () => {
            let result;
            
            // Verify that the contracts have not yet been registered
            result = await ingressContract.getContractAddress(RULES);
            assert.equal(result, "0x0000000000000000000000000000000000000000", 'Rules contract should NOT already be registered');
            result = await ingressContract.getContractAddress(ADMIN);
            assert.equal(result, "0x0000000000000000000000000000000000000000", 'Admin contract should NOT already be registered');

            // Register the contracts
            await ingressContract.setContractAddress(ADMIN, rulesContract.address); 

            // Verify the contract address
            result = await ingressContract.getContractAddress(ADMIN);
            assert.equal(result, rulesContract.address, 'Admin contract address SHOULD be correct');

            // Verify correct number of Contracts
            result = await ingressContract.getAllContractKeys();
            assert.equal(result.length, 1, '1 key SHOULD be registered');
        }),
        it('Should not allow an unauthorized account to perform administration operations', async () => {
            let result;
            
            // Verify that the contracts have not yet been registered
            result = await ingressContract.getContractAddress(RULES);
            assert.equal(result, "0x0000000000000000000000000000000000000000", 'Rules contract should NOT already be registered');
            result = await ingressContract.getContractAddress(ADMIN);
            assert.equal(result, "0x0000000000000000000000000000000000000000", 'Admin contract should NOT already be registered');

            // Register the contracts
            await ingressContract.setContractAddress(ADMIN, rulesContract.address); 

            // Verify the contract address
            result = await ingressContract.getContractAddress(ADMIN);
            assert.equal(result, rulesContract.address, 'Admin contract address SHOULD be correct');

            // Verify correct number of Contracts
            result = await ingressContract.getAllContractKeys();
            assert.equal(result.length, 1, '1 key SHOULD be registered');

            // Verify sender is initially authorized
            result = await ingressContract.isAuthorized(accounts[0]); 
            assert.equal(result, true, 'Sender account SHOULD be authorized');

            // Remove sender from admin list
            await rulesContract.removeAdmin(accounts[0]);

            // Verify sender is no longer authorized
            result = await ingressContract.isAuthorized(accounts[0]); 
            assert.equal(result, false, 'Sender account should NOT be authorized');

            // Attempt to register an additional contract
            try {
                await ingressContract.setContractAddress(RULES, rulesContract.address);
                assert.fail("Unauthorized sender was able to set Contract in registry");
            } catch (err) {
                assert.isOk(err.toString().includes('Not authorized to update contract registry'), 'Expected revert in message');
            }

            // Verify the contract address
            result = await ingressContract.getContractAddress(RULES);
            assert.equal(result, 0x0000000000000000000000000000000000000000, 'Rules contract should NOT be deployed');

            // Verify correct number of Contracts
            result = await ingressContract.getAllContractKeys();
            assert.equal(result.length, 1, '1 key SHOULD be registered');

            // Attempt to remove the Admin contract
            try {
                await ingressContract.removeContract(ADMIN);
                assert.fail("Unauthorized sender was able to remove Contract in registry");
            } catch (err) {
                assert.isOk(err.toString().includes('Not authorized to update contract registry'), 'Expected revert in message');
            }            

            // Verify correct number of Contracts
            result = await ingressContract.getAllContractKeys();
            assert.equal(result.length, 1, '1 key SHOULD be registered');
        }),
        it('Should allow authorized account to perform administration operations', async () => {
            let result;
            
            // Verify that the contracts have not yet been registered
            result = await ingressContract.getContractAddress(RULES);
            assert.equal(result, "0x0000000000000000000000000000000000000000", 'Rules contract should NOT already be registered');
            result = await ingressContract.getContractAddress(ADMIN);
            assert.equal(result, "0x0000000000000000000000000000000000000000", 'Admin contract should NOT already be registered');

            // Register the Admin contract
            await ingressContract.setContractAddress(ADMIN, rulesContract.address); 

            // Verify the Admin contract address
            result = await ingressContract.getContractAddress(ADMIN);
            assert.equal(result, rulesContract.address, 'Admin contract address SHOULD be correct');

            // Verify correct number of Contracts
            result = await ingressContract.getAllContractKeys();
            assert.equal(result.length, 1, '1 key SHOULD be registered');

            // Verify sender is initially authorized
            result = await ingressContract.isAuthorized(accounts[0]); 
            assert.equal(result, true, 'Sender account SHOULD be authorized');

            // Register the Rules contract
            await ingressContract.setContractAddress(RULES, rulesContract.address);
            
            // Verify the Rules contract is registered
            result = await ingressContract.getContractAddress(RULES);
            assert.equal(result, rulesContract.address, 'Rules contract SHOULD be registered');

            // Verify correct number of Contracts
            result = await ingressContract.getAllContractKeys();
            assert.equal(result.length, 2, '2 keys SHOULD be registered');

            // Remove the Rules contract
            await ingressContract.removeContract(RULES);
          
            // Verify that the Rules contract has been removed
            result = await ingressContract.getContractAddress(RULES);
            assert.equal(result, "0x0000000000000000000000000000000000000000", 'Rules contract should NOT be registered');

            // Verify correct number of Contracts
            result = await ingressContract.getAllContractKeys();
            assert.equal(result.length, 1, '1 keys SHOULD be registered');
        })
    }),

    describe('Ingress contract should emit Rules change events', () => {
        it('Should emit an event when the Rules are updated', async () => {
            let result;
            
            // Verify that the Rules contract has not yet been registered
            result = await ingressContract.getContractAddress(RULES);
            assert.equal(result, "0x0000000000000000000000000000000000000000", 'Rules contract should NOT already be registered');

            // Register the Rules contract
            result = await ingressContract.setContractAddress(RULES, rulesContract.address); 

            // Verify the Rules contract address
            result = await ingressContract.getContractAddress(RULES);
            assert.equal(result, rulesContract.address, 'Rules contract address SHOULD be correct');

            // Verify correct number of Contracts
            result = await ingressContract.getAllContractKeys();
            assert.equal(result.length, 1, '1 key SHOULD be registered');

            // Add a more restrictive rule
            await rulesContract.addEnode(nodeHigh, nodeLow, nodeHost, nodePort);

            // Get the events
            result = await ingressContract.getPastEvents('NodePermissionsUpdated', {fromBlock: 0, toBlock: 'latest' });

            // Verify the NodePermissionsUpdated event
            assert.equal(result[0].returnValues.addsRestrictions, false, 'addsRestrictions SHOULD be false');

            // Add a less restrictive rule
            result = await rulesContract.removeEnode(nodeHigh, nodeLow, nodeHost, nodePort);

            // Get the events
            result = await ingressContract.getPastEvents('NodePermissionsUpdated', {fromBlock: 0, toBlock: 'latest' });

            // Verify the NodePermissionsUpdated event
            assert.equal(result[1].returnValues.addsRestrictions, true, 'addsRestrictions SHOULD be true');
        }),
        it('Should only trigger Rules update events when issued from Rules contract', async () => {
            let result;

            const acProxy = await RulesContract.new(ingressContract.address);
            
            // Verify that the contracts have not yet been registered
            result = await ingressContract.getContractAddress(RULES);
            assert.equal(result, "0x0000000000000000000000000000000000000000", 'Rules contract should NOT already be registered');
            result = await ingressContract.getContractAddress(ADMIN);
            assert.equal(result, "0x0000000000000000000000000000000000000000", 'Admin contract should NOT already be registered');

            // Register the contracts
            await ingressContract.setContractAddress(RULES, rulesContract.address); 
            await ingressContract.setContractAddress(ADMIN, acProxy.address); 

            // Verify the contract addresses
            result = await ingressContract.getContractAddress(RULES);
            assert.equal(result, rulesContract.address, 'Rules contract address SHOULD be correct');
            result = await ingressContract.getContractAddress(ADMIN);
            assert.equal(result, acProxy.address, 'Admin contract address SHOULD be correct');

            // Verify correct number of Contracts
            result = await ingressContract.getAllContractKeys();
            assert.equal(result.length, 2, '2 keys SHOULD be registered');

            // Trigger an event from Rules contract
            await rulesContract.triggerRulesChangeEvent(true);

            // Get the events
            result = await ingressContract.getPastEvents('NodePermissionsUpdated', {fromBlock: 0, toBlock: 'latest' });

            // Verify the NodePermissionsUpdated event
            assert.equal(result.length, 1, 'Number of events SHOULD be 1');

            // Attempt to trigger an additional event from Admin contract
            try {
                await acProxy.triggerRulesChangeEvent(true);
                assert.fail("Unauthorized contract was allowed to trigger event")
            } catch (err) {
                assert.isOk(err.toString().includes('Only Rules contract can trigger Rules change events'), 'Expected revert in message');
            }

            // Get the events
            result = await ingressContract.getPastEvents('NodePermissionsUpdated', {fromBlock: 0, toBlock: 'latest' });

            // Verify the NodePermissionsUpdated event
            assert.equal(result.length, 1, 'Number of events SHOULD be 1');
        })
    });
});