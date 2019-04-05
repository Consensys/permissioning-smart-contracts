var Rules = artifacts.require("./Rules.sol");
var Ingress = artifacts.require("./Ingress.sol");

/*
	The ingress contract address must match the address for this contract that is being used in the genesis file
*/
var ingressContractAddress = "0x0000000000000000000000000000000000009999";
var rulesContractName = "Rules";

module.exports = function(deployer, network) {
  if(network === "ganache") {
    // Don't require the Ingress contract to be in a set location
  } else {
    deployer.deploy(Rules).then(function() {
      return Ingress.at(ingressContractAddress);
    }).then(function(ingress){
      ingress.registerName(rulesContractName, Rules.address);
    }).then(function() {
      console.log("   > Updated Ingress contract with Rules name = " + rulesContractName + " and address = " + Rules.address);
    });
  }
};
