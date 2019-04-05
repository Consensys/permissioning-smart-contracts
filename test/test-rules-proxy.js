const IngressContract = artifacts.require('Ingress.sol');
const RulesContract = artifacts.require('Rules.sol');

var node1High = "0x9bd359fdc3a2ed5df436c3d8914b1532740128929892092b7fcb320c1b62f375";
var node1Low = "0x2e1092b7fcb320c1b62f3759bd359fdc3a2ed5df436c3d8914b1532740128929";
var node1Host = "0x0000000000000000000011119bd359fd";
var node1Port = 1;

var node2High = "0x892092b7fcb320c1b62f3759bd359fdc3a2ed5df436c3d8914b1532740128929";
var node2Low = "0xcb320c1b62f37892092b7f59bd359fdc3a2ed5df436c3d8914b1532740128929";
var node2Host = "0x0000000000000000000011119bd359fd";
var node2Port = 2;

contract ('Ingress contract with Rules proxy', () => {
    describe('Ingress contract should execute proxied call', () => {
        it('Should execute proxied call correctly', async () => {
          let result;
          let result2;
          
          const icProxy = await IngressContract.new();
          const rcProxy = await RulesContract.new();
          
          // Verify that the Rules contract has not been registered
          result = await icProxy.getContractDetails("rules");
          assert.equal(result[0], "0x0000000000000000000000000000000000000000", 'Rules contract should NOT already be registered');

          // Register the Rules contract
          await icProxy.registerName("rules", rcProxy.address, 1); 

          // Verify the rules contract has been registered
          result = await icProxy.getContractDetails("rules");
          assert.equal(result[0], rcProxy.address, 'Rules contract has NOT been registered correctly');

          // Verify that the nodes are not permitted to talk
          result = await icProxy.connectionAllowed(node1High, node1Low, node1Host, node1Port, node2High, node2Low, node2Host, node2Port);
          result2 = await rcProxy.connectionAllowed(node1High, node1Low, node1Host, node1Port, node2High, node2Low, node2Host, node2Port);
          assert.equal(result, false, "Connection should NOT be allowed before Enodes have been registered");
          assert.equal(result, result2, "Call and proxy call did NOT return the same value");

          // Add the two Enodes to the Rules register
          result = await rcProxy.addEnode(node1High, node1Low, node1Host, node1Port);
          result = await rcProxy.addEnode(node2High, node2Low, node2Host, node2Port);

          // Verify that the nodes are now able to talk
          result = await icProxy.connectionAllowed(node1High, node1Low, node1Host, node1Port, node2High, node2Low, node2Host, node2Port);
          result2 = await rcProxy.connectionAllowed(node1High, node1Low, node1Host, node1Port, node2High, node2Low, node2Host, node2Port);
          assert.equal(result, true, "Connection SHOULD be allowed after Enodes have been registered");
          assert.equal(result, result2, "Call and proxy call did NOT return the same value");
        });

        it('Should permit changing active Rules contract addresses', async () => {
          let result;
          let result2;
          
          const icProxy = await IngressContract.new();
          const rcProxy1 = await RulesContract.new();
          const rcProxy2 = await RulesContract.new();
          
          // Verify that the Rules contract has not been registered
          result = await icProxy.getContractDetails("rules");
          assert.equal(result[0], "0x0000000000000000000000000000000000000000", 'Rules contract should NOT already be registered');

          // Register the initial Rules contract
          await icProxy.registerName("rules", rcProxy1.address, 1); 

          // Verify the initial rules contract has been registered
          result = await icProxy.getContractDetails("rules");
          assert.equal(result[0], rcProxy1.address, 'Initial contract has NOT been registered correctly');
          assert.equal(result[1], 1, "Registered contract version number does NOT match initial contract");

          // Verify that the nodes are not permitted to talk
          result = await icProxy.connectionAllowed(node1High, node1Low, node1Host, node1Port, node2High, node2Low, node2Host, node2Port);
          result2 = await rcProxy1.connectionAllowed(node1High, node1Low, node1Host, node1Port, node2High, node2Low, node2Host, node2Port);
          assert.equal(result, false, "Connection should NOT be allowed before Enodes have been registered");
          assert.equal(result, result2, "Call and proxy call did NOT return the same value");

          // Add the two Enodes to the Rules register
          result = await rcProxy1.addEnode(node1High, node1Low, node1Host, node1Port);
          result = await rcProxy1.addEnode(node2High, node2Low, node2Host, node2Port);

          // Verify that the nodes are now able to talk
          result = await icProxy.connectionAllowed(node1High, node1Low, node1Host, node1Port, node2High, node2Low, node2Host, node2Port);
          result2 = await rcProxy1.connectionAllowed(node1High, node1Low, node1Host, node1Port, node2High, node2Low, node2Host, node2Port);
          assert.equal(result, true, "Connection SHOULD be allowed after Enodes have been registered");
          assert.equal(result, result2, "Call and proxy call did NOT return the same value");

          // Register the updated Rules contract
          await icProxy.registerName("rules", rcProxy2.address, 2); 

          // Verify the updated rules contract has been registered
          result = await icProxy.getContractDetails("rules");
          assert.equal(result[0], rcProxy2.address, 'Updated contract has NOT been registered correctly');
          assert.equal(result[1], 2, "Registered contract version number does NOT match updated contract");

          // Verify that the nodes are not permitted to talk
          result = await icProxy.connectionAllowed(node1High, node1Low, node1Host, node1Port, node2High, node2Low, node2Host, node2Port);
          result2 = await rcProxy2.connectionAllowed(node1High, node1Low, node1Host, node1Port, node2High, node2Low, node2Host, node2Port);
          assert.equal(result, false, "Connection should NOT be allowed before Enodes have been registered");
          assert.equal(result, result2, "Call and proxy call did NOT return the same value");
        });
    });
});