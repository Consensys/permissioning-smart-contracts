const HDWalletProvider = require("@truffle/hdwallet-provider");

//admin-test
//0xbcEda2Ba9aF65c18C7992849C312d1Db77cF008E
//const privateKey = "919b7e0e4095ce8a2cb22cea25a4d5888981d29d03cbdc714ed4b5f58313fdc6";

//Admin1
//0x7A2327C8D883739E09283A67ac0388A63696cdF9
//const privateKey = "271017cf1ba652a229390636ce6a6ac0e8870224557dffd72d25956e1e30b9f7";

//Admin2
//0x627306090abaB3A6e1400e9345bC60c78a8BEf57
//const privateKey = "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3";

//admin3
//0x173CF75f0905338597fcd38F5cE13E6840b230e9
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
