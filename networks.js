const HDWalletProvider = require("@truffle/hdwallet-provider");
//const privateKey = "919b7e0e4095ce8a2cb22cea25a4d5888981d29d03cbdc714ed4b5f58313fdc6";
const privateKey = "0E273FFD9CF5214F7D6ADE5D1ABFD6D101B648AF12BC2DE6AC4AFCB4DB805CD3";
//const privateKey = "b3e7374dca5ca90c3899dbb2c978051437fb15534c945bf59df16d6c80be27c0";
const privateKeyProvider = new HDWalletProvider(privateKey, "http://34.139.37.41:4545");
//const privateKeyProvider = new HDWalletProvider(privateKey, "http://34.69.22.82:4545");
//const privateKeyProvider = new HDWalletProvider(privateKey, "http://34.74.56.215:4545");  //pro-testnet

module.exports = {
  networks: {
    development: {
      provider: privateKeyProvider,
      network_id: "648532",
      gasPrice: 0,
      gas:10000000
    },
    lacchain: {
      provider: privateKeyProvider,
      network_id: "648529",
      gasPrice: 0,
      gasLimit: 4000000
    },
    david19: {
      provider: privateKeyProvider,
      network_id: "648530",
      gasPrice: 0,
      gas:7000000
    },
  },
};
