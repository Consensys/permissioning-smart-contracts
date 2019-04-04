var Rules = artifacts.require("./Rules.sol");
var Ingress = artifacts.require("./Ingress.sol");

var ingressContractAddress = "0xc9bc439c8723c5c6fdbbe14e5ff3a1224f8a0f7c";
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
