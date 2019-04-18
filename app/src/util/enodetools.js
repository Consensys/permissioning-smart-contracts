export function hexToEnode(hex) {
    var chunks = hex.substring(2).match(/.{1,64}/g);

    var enodeHigh = chunks[0].substring(0, 4)
    var enodeLow = chunks[1].substring(60, 65)
    //TODO proper IP conversion
    // var ip = chunks[2]
    var ip = '127.0.0.1'
    var port = parseInt('0x' + chunks[3])

    return('enode://' + enodeHigh + '...' + enodeLow + '@' + ip + ':' + port)
}

export function hexToObject(hex) {
    var chunks = hex.substring(2).match(/.{1,64}/g);

    var enodeHigh = chunks[0]
    var enodeLow = chunks[1]
    //TODO proper IP conversion
    // var ip = chunks[2]
    var ip = '127.0.0.1'
    var port = parseInt('0x' + chunks[3])

    return {
        nodeId: enodeHigh + enodeLow,
        ip: ip,
        port: port,
        ipHex: chunks[2],
    }
}

export function enodeToParams(enodeURL) {
    var splitUrl = enodeURL.split("//")[1].split("@");
    var enodeId = splitUrl[0]
    var enodeHigh = '0x' + enodeId.slice(0, 64);
    var enodeLow = '0x' + enodeId.slice(64);
    var ip = splitUrl[1].split(':')[0]
    var port = splitUrl[1].split(':')[1].split("?")[0]

    var params = []
    params[0] = enodeHigh;
    params[1] = enodeLow;
    params[2] = getHexIpv4(ip);
    params[3] = port;

    return params;
}

function getHexIpv4(stringIp) {
    var splitIp = stringIp.split(".");
    return `0x00000000000000000000ffff${toHex(splitIp[0])}${toHex(splitIp[1])}${toHex(splitIp[2])}${toHex(splitIp[3])}`;
}

function toHex(number) {
    var num = Number(number).toString(16);
    return num.length < 2 ? `0${num}` : num;
}

export function isSameEnodeList(list, another) {
    if (list.length !== another.length) {
        return false;
    }

    for (var i = 0; i < list.length; i++) {
        if (list[i].nodeId !== another[i].nodeId ||
            list[i].ip !== another[i].ip ||
            list[i].port !== another[i].port) {
            return false;
        }
    }

    return true;
}

export function containsEnodeObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (obj.nodeId === list[i].nodeId &&
            obj.ip === list[i].ip &&
            obj.port === list[i].port) {
            return true;
        }
    }

    return false;
}