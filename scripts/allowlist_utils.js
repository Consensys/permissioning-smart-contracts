const Web3Utils = require("web3-utils");
const url = require('url');

const enodeToParams = enodeURL => {
    let enodeId = "";
    let host = "";
    let port = "";
    let extraParams = {};

    try {
        const node = new URL(enodeURL);
        if (node.protocol === 'enode:') {
            if (node.username.length === 128) {
                enodeId = node.username;
            }

            host = node.hostname
            port = node.port;

            node.searchParams.forEach((value, name, searchParams) => { extraParams[name.toLowerCase()] = value; });
        }
    } catch (err) {}

    return {
        enodeId,
        host,
        port,
        extraParams
    };
};

const isValidEnode = str => {
    return !Object.values(enodeToParams(str)).some(value => !value);
};

function isInitialAdminAccountsAvailable() {
    return process.env.INITIAL_ADMIN_ACCOUNTS;
}

function isInitialAllowlistedAccountsAvailable() {
    if (process.env.INITIAL_ALLOWLISTED_ACCOUNTS) {
        return process.env.INITIAL_ALLOWLISTED_ACCOUNTS;
    }
}

function isInitialAllowlistedNodesAvailable() {
    if (process.env.INITIAL_ALLOWLISTED_NODES) {
        return process.env.INITIAL_ALLOWLISTED_NODES;
    }
}

function getInitialAdminAccounts() {
    console.log(isInitialAdminAccountsAvailable());
    return getAccounts(isInitialAdminAccountsAvailable());
}

function getInitialAllowlistedAccounts() {
    console.log(isInitialAllowlistedAccountsAvailable());
    return getAccounts(isInitialAllowlistedAccountsAvailable());
}

function getInitialAllowlistedNodes() {
    let envInitialAllowlistedNodes = isInitialAllowlistedNodesAvailable();
    console.log(isInitialAllowlistedNodesAvailable());
    let validENodes = new Set();
    if (envInitialAllowlistedNodes) {
        let invalidENodes = new Set();
        let initialAllowlistedNodesList = envInitialAllowlistedNodes.split(/,/).map(n => n.trim());

        //Convert to enode structure
        if(initialAllowlistedNodesList && initialAllowlistedNodesList.length > 0) {
            for (i=0; i < initialAllowlistedNodesList.length; i++) {
                let enode = initialAllowlistedNodesList[i];
                if (isValidEnode(enode)) {
                    if(validENodes.has(enode)) {
                        console.log("     > Warning: Duplicate eNode Address: " + enode);
                    } else {
                        validENodes.add(enode);
                    }
                } else {
                    invalidENodes.add(enode);
                }
            }

            if (invalidENodes.size > 0) {
                throw "" + [...invalidENodes];
            }
        }  
    } 
    return [...validENodes];
}

function getAccounts(accounts) {
    if (accounts) {
        let invalidAccounts = new Set();
        let validAccounts = new Set();
        let accountsArray = accounts.split(/,/).map(
            function(acc) {
                let trimmedAcc = acc.trim();
                if (!trimmedAcc.startsWith("0x")) {
                    trimmedAcc = "0x" + trimmedAcc;
                }
                trimmedAcc = trimmedAcc.toLowerCase();
                if (!Web3Utils.isAddress(trimmedAcc)) {
                    invalidAccounts.add(trimmedAcc);
                }
                return trimmedAcc;
            }
        );

        if(invalidAccounts.size > 0) {
            throw "" + [...invalidAccounts];
        }

        for (i=0; i < accountsArray.length; i++) {
            if (validAccounts.has(accountsArray[i])) {
                console.log("     > Warning: Duplicate address: " + accountsArray[i]);
            } else {
                validAccounts.add(accountsArray[i]);
            }
        }

        if (validAccounts.size > 0) {
            return [...validAccounts];
        }    
    }
    
    return [];
}

function getRetainAdminContract() {
    if (process.env.RETAIN_ADMIN_CONTRACT) {
        return "true" === process.env.RETAIN_ADMIN_CONTRACT;
    } else {
        return false;
    }

}

function getRetainNodeRulesContract() {
    if (process.env.RETAIN_NODE_RULES_CONTRACT) {
        return "true" === process.env.RETAIN_NODE_RULES_CONTRACT;
    } else {
        return false;
    }

}

function getRetainAccountRulesContract() {
    if (process.env.RETAIN_ACCOUNT_RULES_CONTRACT) {
        return "true" === process.env.RETAIN_ACCOUNT_RULES_CONTRACT;
    } else {
        return false;
    }

}

module.exports = {
    enodeToParams,
    isInitialAdminAccountsAvailable,
    isInitialAllowlistedAccountsAvailable,
    isInitialAllowlistedNodesAvailable,
    getInitialAdminAccounts,
    getInitialAllowlistedAccounts,
    getInitialAllowlistedNodes,
    getRetainAdminContract,
    getRetainNodeRulesContract,
    getRetainAccountRulesContract
 }