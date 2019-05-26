import Rules from "./contracts/Rules.json";
import Admin from "./contracts/Admin.json";

const options = {
    web3: {
        block: false,
        fallback: {}
    },
    contracts: [Rules, Admin],
    events: {},
    polls: {
        accounts: 1500
    }
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
