import AccountRules from './chain/abis/AccountRules.json';
import NodeRules from './chain/abis/NodeRules.json';
import Admin from './chain/abis/Admin.json';
import { Config } from './util/configLoader';

const options = (config: Config) => {
  return {
    web3: {
      block: false,
      fallback: {}
    },
    contracts: [AccountRules, NodeRules, Admin],
    events: {},
    polls: {
      accounts: 1500
    }
  };
};

export default options;

// How to programatically add contracts
// var contractConfig = {
//   contractName: "0x066408929e8d5Ed161e9cAA1876b60e1fBB5DB75",
//   web3Contract: new web3.eth.Contract(/* ... */)
// }

// Using an action
// dispatch({type: 'ADD_CONTRACT', drizzle, contractConfig, events, web3})

// Or using the Drizzle context object
// this.context.drizzle.addContract({contractConfig, events})
