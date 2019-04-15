var Ingress = artifacts.require("./Ingress.sol");

/* The address of the ingress contract if pre deployed */
var ingressAddress = process.env.INGRESS_CONTRACT_ADDRESS;

module.exports = (deployer, network) => {
    if (! ingressAddress) {
        // Only deploy if we haven't been provided a predeployed address
        deployer.deploy(Ingress).then(() => {
            console.log("   > Deployed Ingress contract to address = " + Ingress.address);
        });

    } else {
        // If supplied an address, make sure there's something there
        const ingressInstance = Ingress.at(ingressAddress);
        try {
            ingressInstance.getContractVersion();
            console.log("   > Ingress contract previously initialised at address = " + ingressAddress);
        } catch {
            console.error("   > Predeployed Ingress contract is not responding like an Ingress contract at address = " + ingressAddress);
        }
    }
}