# Permissioning Smart Contracts

**Note:** The contracts herein have been third party audited. [Please
contact us](https://pegasys.tech/contact/) if you would like more information, or if you are considering using this Dapp in a production environment.

## Using

The [Besu documentation](https://besu.hyperledger.org/en/stable/Tutorials/Permissioning/Getting-Started-Onchain-Permissioning/)
describes how to use the contracts for onchain permissioning.

## Development
_Note: The build process for the Dapp is currently not supported on Windows. Please use the provided distribution available at [projects release page](https://github.com/hyperledger/besu-permissioning-smart-contracts/releases/latest) if on Windows._

### Initialise dependencies ###
Run `yarn install` to initialise project dependencies. This step is only required when setting up project 
for the first time. 

### Linting
Linting is set up using solium. To run it over your code execute `yarn run lint`.

### Testing
`yarn test`

### Permissioning Management Dapp

The Dapp will facilitate managing permissioning rules and maintaining the list of admin accounts that can edit rules.

This is the easiest way to get started for development with the permissioning Dapp:

#### Compile and migrate the contracts (Development mode) ####
1. Get rid of your environment variables named `NODE_INGRESS_CONTRACT_ADDRESS`, `ACCOUNT_INGRESS_CONTRACT_ADDRESS` AND 
`NETWORK_ID` - you might need to restart your terminal session after removing it to have your changes applied. If you are using a `.env` file, you can comment out the variables.
1. Start a terminal session and start a truffle Ganache node running `truffle develop`. This will start a Ganache node and create a truffle console session.
1. In the truffle console, run all migrations from scratch with `migrate --reset`. Keep this terminal session open to maintain your Ganache node running.

#### Start the development server ####
1. Run `yarn run build` to build the Dapp.
1. Run `yarn run start` to start the web server that is serving our Dapp.
1. In your browser, connect Metamask to the Ganache network (the default endpoint is `http://127.0.0.1:9545/`)
1. When you start Ganache, it gives you a list of accounts and private keys. Import the first one in Metamask to impersonate the first admin of the system.
1. Navigate to `http://localhost:3000` to access the Permissioning Dapp.
1. All changes made to the smart contracts or to the Dapp code are automatically refreshed on the website. There is no need to restart the web server after making changes.

#### Build the permissioning Dapp for deployment ####

1. [Compile and migrate the contracts](#compile-and-migrate-the-contracts)
1. Run `yarn run build` will assemble index.html and all other files in `build/`
1. You can use your preferred web server technology to serve the contents of `build/` as static files.
1. You will need to set up MetaMask as for [the development server](#start-the-development-server)

## Deployment
The deployment process covers 3 steps:
1. Starting a Besu node with the required configurations.
2. Migrating the contracts provided in this repository to the running chain.
3. Running the Dapp on a webserver.

### Starting a Besu node
1. Have a Besu node running a chain that has the Node Ingress and Account Ingress contracts in its genesis accounts as shown in the alloc block of the [example genesis file](https://github.com/PegaSysEng/permissioning-smart-contracts/blob/master/genesis.json)

### Deploying the contracts
1. Configure environment variables or provide a .env file in the root of this project that configures the following variables
  - `NODE_INGRESS_CONTRACT_ADDRESS`: The address of the node ingress contract from the genesis accounts
  - `ACCOUNT_INGRESS_CONTRACT_ADDRESS`: The address of the account ingress contract from the genesis accounts
  - `BESU_NODE_PERM_ACCOUNT`: The address of the account that will be used to deploy the contracts
  - `BESU_NODE_PERM_KEY`: The private key associated with the deploying account's address
  - `BESU_NODE_PERM_ENDPOINT`: The json rpc url endpoint that can be used to communicate with your Besu node

2. The following environment variables are optional and can be used to whitelist accounts and nodes during initial contract deployment. 
  - `INITIAL_ADMIN_ACCOUNTS`: The admin account addresses. Comma separated multiple addresses can be specified
  - `INITIAL_WHITELISTED_ACCOUNTS`: The whitelisted account addresses. Comma separated multiple addresses can be specified
  - `INITIAL_WHITELISTED_NODES`: The enode URLs of whitelisted nodes. Comma separated multiple nodes can be specified
3. If this is the first time setting up the project, run `yarn install` to initialise project dependencies, otherwise skip this step. 
4. With these environment variables provided run `truffle migrate --reset` to deploy the contracts

### Deploying the Dapp
1. Obtain the most recent release (tarball or zip) from the [projects release page](https://github.com/PegaSysEng/permissioning-smart-contracts/releases/latest)
2. Unpack the distribution into a folder that will be available to your webserver
3. Add to the root of that folder a file `config.json` with the following contents

_Note: The `networkID` is defined as the `chainID` in the genesis file._
```
{
        "accountIngressAddress":  "<Address of the account ingress contract>",
        "nodeIngressAddress": "<Address of the node ingress contract>",
        "networkId": "<ID of your ethereum network>"
}
```
4. Use a webserver of your choice to host the contents of the folder as static files directing root requests to `index.html`
