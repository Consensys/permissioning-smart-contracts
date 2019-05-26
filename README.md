# Permissioning Smart Contracts

**Note:** The contracts in this repository are currently in the process of going through a third party audit. [Please
contact us](https://pegasys.tech/contact/) before using in a production environment.

## Using

The [Pantheon documentation](https://docs.pantheon.pegasys.tech/en/stable/Permissions/Onchain-Permissioning/)
describes how to use the contracts for onchain permissioning.

## Development

### Linting
Linting is set up using solium. To run it over your code execute `npm run lint`.

### Testing
`npm test`

### Permissioning Management Dapp (under development)

The Permissisioning Management Dapp is still in BETA. It is under active development and shouldn't be used in any production system.

The Dapp will facilitate managing permissioning rules and maintaining the list of admin accounts that can edit rules.

At the moment, these instructions won't say anything about linking the Dapp with your Pantheon node. This integration will be documented in the future. The instructions here are targeted to developers working on the Dapp development, not users.

This is the easiest way to get started:

1. Get rid of your environment variable named `INGRESS_CONTRACT_ADDRESS` - you might need to restart your terminal session after removing it to have your changes applied. If you are using a `.env` file, you can comment the `INGRESS_CONTRACT_ADDRESS` variable.
1. Start a terminal session and start a truffle Ganache node running `truffle develop`. This will start a Ganache node and create a truffle console session.
1. In the truffle console, run all migrations from scratch with `migrate --reset`. Keep this terminal session open to maintain your Ganache node running.
1. In a new terminal session, navigate to the `app/` directory and run `npm install` to install all required dependencies and `npm start` to start the web server that is serving our dapp. You only need to run `npm install` if you are running the app for the first time.
1. In your browser, connect Metamask to the Ganache network (the default endpoint is `http://127.0.0.1:9545/`)
1. When you start Ganache, it gives you a list of accounts and private keys. Import the first one in Metamask to impersonate the first admin of the system.
1. Navigate to `http://localhost:3000` to access the Permissioning Dapp.
1. All changes made to the smart contracts or to the dapp code are automatically refreshed on the website. There is no need to restart the web server after making changes.
