const HDWalletProvider = require('truffle-hdwallet-provider');
const path = require("path");
const dotenv = require('dotenv');

dotenv.config();

/* The adress used when sending transactions to the node */
var address = process.env.PANTHEON_NODE_PERM_ACCOUNT;

/* The private key associated with the address above */
var privateKey = process.env.PANTHEON_NODE_PERM_KEY;

/* The endpoint of the Ethereum node */
var endpoint = process.env.PANTHEON_NODE_PERM_ENDPOINT;
if (endpoint === undefined) {
  endpoint = "http://127.0.0.1:8545";
}

module.exports = {
  networks: {
    development: {
     provider: () => new HDWalletProvider(privateKey, endpoint),
     host: "127.0.0.1",
     port: 8545,
     network_id: "*",
     from: address
    },
    ganache: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*',
    },
    coverage: {
      host: "localhost",
      network_id: "*",
      port: 8545,
      gas: 0xfffffffffff,
      gasPrice: 0x01
    }
  },

  contracts_build_directory: path.join(__dirname, "src/chain/abis"),

  compilers: {
    solc: {
      version: "0.5.7",
      settings: {
       optimizer: {
         enabled: false,
         runs: 200
       },
      }
    }
  },

  mocha: {
    useColors: true,
    reporter: 'mocha-multi-reporters',
    reporterOptions: {
      configFile: './mocha-reporter-config.json',
    },
  }
};
