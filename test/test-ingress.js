const IngressContract = artifacts.require('Ingress.sol');
const RulesContract = artifacts.require('Rules.sol');

const RULES='0x72756c6573000000000000000000000000000000000000000000000000000000';
const ADMIN='0x61646d696e697374726174696f6e000000000000000000000000000000000000';

contract ('Ingress contract', (accounts) => {
    describe('Ingress contract should register contract', () => {
        it('Should return empty value if contract not registered', async () => {
          let result;
          
          const icProxy = await IngressContract.new();
          // Verify that the Rules contract has not been registered
          result = await icProxy.getContractAddress(RULES);
          assert.equal(result, "0x0000000000000000000000000000000000000000", 'Rules contract should NOT already be registered');
        });

        it('Should register contract successfully', async () => {
            let result;
            
            const icProxy = await IngressContract.new();
            const rcProxy = await RulesContract.new();
            
            // Verify that the Rules contract has not yet been registered
            result = await icProxy.getContractAddress(RULES);
            assert.equal(result, "0x0000000000000000000000000000000000000000", 'Rules contract should NOT already be registered');

            // Register the Rules contract
            result = await icProxy.setContractAddress(RULES, rcProxy.address); 

            // Verify the Rules contract address
            result = await icProxy.getContractAddress(RULES);
            assert.equal(result, rcProxy.address, 'Rules contract address SHOULD be correct');
        });

        it('Should return all registered contracts', async () => {
            let result;
            
            const icProxy = await IngressContract.new();
            const rcProxy = await RulesContract.new();

            // Register a Rules contract
            await icProxy.setContractAddress(RULES, rcProxy.address);
            
            // Register an 'Admin' contract
            await icProxy.setContractAddress(ADMIN, rcProxy.address);

            result = await icProxy.getAllContractKeys();
        
            assert.equal(result[0], RULES, 'Rules contract SHOULD be registered');
            assert.equal(result[1], ADMIN, 'Admin contract SHOULD be registered');
        });
    }),
    describe('Ingress contract should delete specified contract', () => {
        it('Should delete a specified contract', async () => {
            let result;
            
            const icProxy = await IngressContract.new();
            const rcProxy = await RulesContract.new();
            
            // Verify that the Rules contract has not yet been registered
            result = await icProxy.getContractAddress(RULES);
            assert.equal(result, "0x0000000000000000000000000000000000000000", 'Rules contract should NOT already be registered');

            // Register the Rules contract
            result = await icProxy.setContractAddress(RULES, rcProxy.address); 

            // Verify the Rules contract address
            result = await icProxy.getContractAddress(RULES);
            assert.equal(result, rcProxy.address, 'Rules contract address SHOULD be correct');

            // Verify correct number of Contracts
            result = await icProxy.getAllContractKeys();
            assert.equal(result.length, 1, '1 key SHOULD be registered');

            // Delete the Rules contract
            await icProxy.removeContract(RULES);

            // Verify that the Rules contract has been deleted
            result = await icProxy.getContractAddress(RULES);
            assert.equal(result, "0x0000000000000000000000000000000000000000", 'Rules contract SHOULD have been deleted');

            // Verify correct number of Contracts
            result = await icProxy.getAllContractKeys();
            assert.equal(result.length, 0, '0 keys SHOULD be registered');
        })
    }),
    describe('Ingress contract should enforce Admin authorization', () => {
        it('Should allow an unauthorized account to initially deploy Administration Contract', async () => {
            let result;
            
            const icProxy = await IngressContract.new();
            const rcProxy = await RulesContract.new();
            
            // Verify that the contracts have not yet been registered
            result = await icProxy.getContractAddress(RULES);
            assert.equal(result, "0x0000000000000000000000000000000000000000", 'Rules contract should NOT already be registered');
            result = await icProxy.getContractAddress(ADMIN);
            assert.equal(result, "0x0000000000000000000000000000000000000000", 'Admin contract should NOT already be registered');

            // Register the contracts
            await icProxy.setContractAddress(ADMIN, rcProxy.address); 

            // Verify the contract address
            result = await icProxy.getContractAddress(ADMIN);
            assert.equal(result, rcProxy.address, 'Admin contract address SHOULD be correct');

            // Verify correct number of Contracts
            result = await icProxy.getAllContractKeys();
            assert.equal(result.length, 1, '1 key SHOULD be registered');
        }),
        it('Should not allow an unauthorized account to perform administration operations', async () => {
            let result;
            
            const icProxy = await IngressContract.new();
            const rcProxy = await RulesContract.new();
            
            // Verify that the contracts have not yet been registered
            result = await icProxy.getContractAddress(RULES);
            assert.equal(result, "0x0000000000000000000000000000000000000000", 'Rules contract should NOT already be registered');
            result = await icProxy.getContractAddress(ADMIN);
            assert.equal(result, "0x0000000000000000000000000000000000000000", 'Admin contract should NOT already be registered');

            // Register the contracts
            await icProxy.setContractAddress(ADMIN, rcProxy.address); 

            // Verify the contract address
            result = await icProxy.getContractAddress(ADMIN);
            assert.equal(result, rcProxy.address, 'Admin contract address SHOULD be correct');

            // Verify correct number of Contracts
            result = await icProxy.getAllContractKeys();
            assert.equal(result.length, 1, '1 key SHOULD be registered');

            // Verify sender is initially authorized
            result = await icProxy.isAuthorized(accounts[0]); 
            assert.equal(result, true, 'Sender account SHOULD be authorized');

            // Remove sender from admin list
            await rcProxy.removeAdmin(accounts[0]);

            // Verify sender is no longer authorized
            result = await icProxy.isAuthorized(accounts[0]); 
            assert.equal(result, false, 'Sender account should NOT be authorized');

            // Attempt to register an additional contract
            try {
                await icProxy.setContractAddress(RULES, rcProxy.address);
            } catch (err) {
                assert(true, err.toString().includes('Not authorized to update contract registry'), 'Expected revert in message');
            }

            // Verify the contract address
            result = await icProxy.getContractAddress(RULES);
            assert.equal(result, 0x0000000000000000000000000000000000000000, 'Rules contract should NOT be deployed');

            // Verify correct number of Contracts
            result = await icProxy.getAllContractKeys();
            assert.equal(result.length, 1, '1 key SHOULD be registered');

            // Attempt to remove the Admin contract
            try {
                await icProxy.removeContract(ADMIN);
            } catch (err) {
                assert(true, err.toString().includes('Not authorized to update contract registry'), 'Expected revert in message');
            }            

            // Verify correct number of Contracts
            result = await icProxy.getAllContractKeys();
            assert.equal(result.length, 1, '1 key SHOULD be registered');
        }),
        it('Should allow authorized account to perform administration operations', async () => {
            let result;
            
            const icProxy = await IngressContract.new();
            const rcProxy = await RulesContract.new();
            
            // Verify that the contracts have not yet been registered
            result = await icProxy.getContractAddress(RULES);
            assert.equal(result, "0x0000000000000000000000000000000000000000", 'Rules contract should NOT already be registered');
            result = await icProxy.getContractAddress(ADMIN);
            assert.equal(result, "0x0000000000000000000000000000000000000000", 'Admin contract should NOT already be registered');

            // Register the Admin contract
            await icProxy.setContractAddress(ADMIN, rcProxy.address); 

            // Verify the Admin contract address
            result = await icProxy.getContractAddress(ADMIN);
            assert.equal(result, rcProxy.address, 'Admin contract address SHOULD be correct');

            // Verify correct number of Contracts
            result = await icProxy.getAllContractKeys();
            assert.equal(result.length, 1, '1 key SHOULD be registered');

            // Verify sender is initially authorized
            result = await icProxy.isAuthorized(accounts[0]); 
            assert.equal(result, true, 'Sender account SHOULD be authorized');

            // Register the Rules contract
            await icProxy.setContractAddress(RULES, rcProxy.address);
            
            // Verify the Rules contract is registered
            result = await icProxy.getContractAddress(RULES);
            assert.equal(result, rcProxy.address, 'Rules contract SHOULD be registered');

            // Verify correct number of Contracts
            result = await icProxy.getAllContractKeys();
            assert.equal(result.length, 2, '2 keys SHOULD be registered');

            // Remove the Rules contract
            await icProxy.removeContract(RULES);
          
            // Verify that the Rules contract has been removed
            result = await icProxy.getContractAddress(RULES);
            assert.equal(result, "0x0000000000000000000000000000000000000000", 'Rules contract should NOT be registered');

            // Verify correct number of Contracts
            result = await icProxy.getAllContractKeys();
            assert.equal(result.length, 1, '1 keys SHOULD be registered');
        })
    });
});