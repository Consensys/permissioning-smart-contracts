# Permissioning Smart Contracts

**Note:** The contracts in this repository are currently in the process of going through a third party audit. [Please
contact us](https://pegasys.tech/contact/) before using in a production environment.

## Using

The [Pantheon documentation](https://docs.pantheon.pegasys.tech/en/stable/Permissions/Onchain-Permissioning/)
describes how to use the contracts for onchain permissioning.

## Development

### Linting
Linting is set up using solium. To run it over your code execute `yarn run lint`.

### Testing
`yarn test`

### Permissioning Management Dapp (under development)

The Permissisioning Management Dapp is still in BETA. It is under active development and shouldn't be used in any production system.

The Dapp will facilitate managing permissioning rules and maintaining the list of admin accounts that can edit rules.

At the moment, these instructions won't say anything about linking the Dapp with your Pantheon node. This integration will be documented in the future. The instructions here are targeted to developers working on the Dapp development, not users.

This is the easiest way to get started for development with the permissioning Dapp:

#### Compile and migrate the contracts ####
1. Get rid of your environment variables named `NODE_INGRESS_CONTRACT_ADDRESS` and `ACCOUNT_INGRESS_CONTRACT_ADDRESS` - you might need to restart your terminal session after removing it to have your changes applied. If you are using a `.env` file, you can comment out the variables.
1. Start a terminal session and start a truffle Ganache node running `truffle develop`. This will start a Ganache node and create a truffle console session.
1. In the truffle console, run all migrations from scratch with `migrate --reset`. Keep this terminal session open to maintain your Ganache node running.

#### Start the development server ####
1. Run `yarn install` to install all required dependencies. (You only need to run `yarn install` if you are running the app for the first time.)
1. Run `yarn run build` to build the dapp. 
1. Run `yarn run start` to start the web server that is serving our dapp. 
1. In your browser, connect Metamask to the Ganache network (the default endpoint is `http://127.0.0.1:9545/`)
1. When you start Ganache, it gives you a list of accounts and private keys. Import the first one in Metamask to impersonate the first admin of the system.
1. Navigate to `http://localhost:3000` to access the Permissioning Dapp.
1. All changes made to the smart contracts or to the dapp code are automatically refreshed on the website. There is no need to restart the web server after making changes.

#### Build the permissioning Dapp for deployment ####

1. [Compile and migrate the contracts](#compile-and-migrate-the-contracts)
1. Run `yarn run build` will assemble index.html and all other files in `build/`
1. You can use your preferred web server technology to serve the contents of `build/` as static files.
1. You will need to set up MetaMask as for [the development server](#start-the-development-server)
