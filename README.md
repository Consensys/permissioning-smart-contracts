# Permissioning Smart Contracts

## Requirements
1. [NodeJS](https://nodejs.org/en/) v8.9.4 or later
1. A Pantheon node running with a [permissioning enabled genesis](https://github.com/PegaSysEng/pantheon) file (genesis file with the Ingress contract embedded).
1. [Truffle installed](https://truffleframework.com/docs/truffle/getting-started/installation)

## Initial setup
1. Run `npm install`.
1. Open `truffle-config.js`.
1. Update `address` and `privateKey` variable to match your account and the corresponding private key.
1. If your node is not using the default JSON-RPC host and port, update line 12 (`http://127.0.0.1:8545`) to match your node configuration.


## How to deploy and setup contracts
1. Run `truffle compile`
1. Run `truffle migrate`

After this step, you should have your Rules contract deployed on the network.

## Add and Remove Enodes to the whitelist
1. Run `truffle console`
1. Open https://permissioning-tools.pegasys.tech/
1. Type the enode that you want to include in the whitelist in the input box.
1. Click "Process".
1. Copy the truffe command output.
1. Paste the truffle command into the console and press enter.

Example truffle output from the website
```
Rules.deployed().then(function(instance) {instance.addEnodeIpv4("0x6f8a80d14311c39f35f516fa664deaaaa13e85b2f7493f37f6144d86991ec012", "0x937307647bd3b9a82abe2974e1407241d54947bbb39763a4cac9f77166ad92a0", "0x0a033a06", "30303").then(function(tx) {console.log(tx)});});
```

After this step, you should have the enode added to your whitelist. Please repeat this step for each enode that you want to add to the whitelist.

## Configure Ingress contract with Rules contract address
1. TODO