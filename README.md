# Permissioning Smart Contracts

**Note:** The contracts in this repository are currently in the process of going through a third party audit. [Please
contact us](https://pegasys.tech/contact/) before using in a production environment.

## Using

The [Pantheon documentation](https://docs.pantheon.pegasys.tech/en/stable/Permissions/Onchain-Permissioning/)
describes how to use the contracts for onchain permissioning.

## Development

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

#### Compile and migrate the contracts ####
1. Get rid of your environment variables named `NODE_INGRESS_CONTRACT_ADDRESS` and `ACCOUNT_INGRESS_CONTRACT_ADDRESS` - you might need to restart your terminal session after removing it to have your changes applied. If you are using a `.env` file, you can comment out the variables.
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

### Deploying the contracts
1. Have a Pantheon node running a chain that has the Node Ingress and Account Ingress contracts in its genesis accounts as shown in the alloc block of the [example genesis file](https://github.com/PegaSysEng/permissioning-smart-contracts/blob/master/genesis.json)
1. Configure environment variables or provide a .env file in the root of this project that configures the following variables
  - `NODE_INGRESS_CONTRACT_ADDRESS`: The address of the node ingress contract from the genesis accounts
  - `ACCOUNT_INGRESS_CONTRACT_ADDRESS`: The address of the account ingress contract from the genesis accounts
  - `PANTHEON_NODE_PERM_ACCOUNT`: The address of the account that will be used to deploy the contracts
  - `PANTHEON_NODE_PERM_KEY`: The private key associated with the deploying account's address
  - `PANTHEON_NODE_PERM_ENDPOINT`: The json rpc url endpoint that can be used to communicate with your Pantheon node
1. With these environment variables provided run `truffle migrate --reset` to deploy the contracts

### Deploying the Dapp
1. Obtain the most recent release (tarball or zip) from the [projects release page](https://github.com/PegaSysEng/permissioning-smart-contracts/releases/latest)
1. Unpack the distribution into a folder that will be available to your webserver
1. Add to the root of that folder a file `config.json` with the following contents
```
{
        "accountIngressAddress":  "<Address of the account ingress contract>",
        "nodeIngressAddress": "<Address of the node ingress contract>",
        "networkId": "<ID of your ethereum network>"
}
```
1. Use a webserver of your choice to host the contents of the folder as static files directing root requests to `index.html`
