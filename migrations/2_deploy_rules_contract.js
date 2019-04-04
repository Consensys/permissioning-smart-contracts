var Rules = artifacts.require("./Rules.sol");
var Ingress = artifacts.require("./Ingress.sol");

/*
	The ingress contract address must match the address for this contract that is being used in the genesis file
*/
var ingressContractAddress = "0x0000000000000000000000000000000000009999";
var rulesContractName = "Rules";
var rulesVersion = 1000000;

module.exports = function(deployer) {
  deployer.deploy(Rules).then(function() {
  	return Ingress.at(ingressContractAddress);
  }).then(function(ingress){
  	ingress.registerName(rulesContractName, Rules.address, rulesVersion);
  }).then(function() {
  	console.log("   > Updated Ingress contract with Rules name = " + rulesContractName + ", address = " + Rules.address + ", and version = " + rulesVersion);
  });
};
