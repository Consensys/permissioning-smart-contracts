const HDWalletProvider = require('truffle-hdwallet-provider');
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
  },
  
  compilers: {
    solc: {
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
