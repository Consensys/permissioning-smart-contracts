const IngressContract = artifacts.require('Ingress.sol');
const RulesContract = artifacts.require('Rules.sol');

const RULES='0x72756c6573000000000000000000000000000000000000000000000000000000';
const ADMIN='0x61646d696e697374726174696f6e000000000000000000000000000000000000';

contract ('Ingress contract', () => {
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

            result = await icProxy.getAllContactKeys();
        
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
            result = await icProxy.getAllContactKeys();
            assert.equal(result.length, 1, '1 key SHOULD be registered');

            // Delete the Rules contract
            await icProxy.removeContract(RULES);

            // Verify that the Rules contract has been deleted
            result = await icProxy.getContractAddress(RULES);
            assert.equal(result, "0x0000000000000000000000000000000000000000", 'Rules contract SHOULD have been deleted');

            // Verify correct number of Contracts
            result = await icProxy.getAllContactKeys();
            assert.equal(result.length, 0, '0 keys SHOULD be registered');
        })
    });
});