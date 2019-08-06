const Web3Utils = require("web3-utils");

const enodeToParams = enodeURL => {
    let enodeHigh = "";
    let enodeLow = "";
    let ip = "";
    let port = "";

    const splitURL = enodeURL.split("//")[1];
    if (splitURL) {
        const [enodeId, rawIpAndPort] = splitURL.split("@");
        if (enodeId && enodeId.length === 128) {
            enodeHigh = "0x" + enodeId.slice(0, 64);
            enodeLow = "0x" + enodeId.slice(64);
        }
        if (rawIpAndPort) {
            const [ipAndPort] = rawIpAndPort.split("?");
            if (ipAndPort) {
                [ip, port] = ipAndPort.split(":");
            }
        }
    }
    return {
        enodeHigh,
        enodeLow,
        ip: ip ? getHexIpv4(ip) : "",
        port
    };
};

const isValidEnode = str => {
    return !Object.values(enodeToParams(str)).some(value => !value);
};

function isInitialAdminAccountsAvailable() {
    return process.env.INITIAL_ADMIN_ACCOUNTS;
}

function isInitialWhitelistedAccountsAvailable() {
    return process.env.INITIAL_WHITELISTED_ACCOUNTS;
}

function isInitialWhitelistedNodesAvailable() {
    return process.env.INITIAL_WHITELISTED_NODES;
}

function getInitialAdminAccounts() {
    return getAccounts(isInitialAdminAccountsAvailable());
}

function getInitialWhitelistedAccounts() {
    return getAccounts(isInitialWhitelistedAccountsAvailable());
}

function getInitialWhitelistedNodes() {
    let envInitialWhitelistedNodes = isInitialWhitelistedNodesAvailable();
    let validENodes = new Set();
    if (envInitialWhitelistedNodes) {
        let invalidENodes = new Set();
        let initialWhitelistedNodesList = envInitialWhitelistedNodes.split(/,/).map(n => n.trim());

        //Convert to enode structure
        if(initialWhitelistedNodesList && initialWhitelistedNodesList.length > 0) {
            for (i=0; i < initialWhitelistedNodesList.length; i++) {
                let enode = initialWhitelistedNodesList[i];
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


function getHexIpv4(stringIp) {
    const splitIp = stringIp.split(".");
    return `0x00000000000000000000ffff${toHex(splitIp[0])}${toHex(
        splitIp[1]
    )}${toHex(splitIp[2])}${toHex(splitIp[3])}`;
}

function toHex(number) {
    const num = Number(number).toString(16);
    return num.length < 2 ? `0${num}` : num;
}

module.exports = {
    enodeToParams,
    isInitialAdminAccountsAvailable,
    isInitialWhitelistedAccountsAvailable,
    isInitialWhitelistedNodesAvailable,
    getInitialAdminAccounts,
    getInitialWhitelistedAccounts,
    getInitialWhitelistedNodes
 }