const HDWalletProvider = require('truffle-hdwallet-provider');

/* The adress used when sending transactions to the node */
var address = "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73";

/* The private key associated with the address above */
var privateKey = "8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63";

module.exports = {
  networks: {
    development: {
     provider: () => new HDWalletProvider(privateKey, "http://127.0.0.1:8545"),
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
  }
};
