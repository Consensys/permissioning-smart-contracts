export const enodeToParams = enodeURL => {
    let enodeHigh = null;
    let enodeLow = null;
    let ip = null;
    let port = null;

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
        ip: ip ? getHexIpv4(ip) : null,
        port
    };
};

export const paramsToIdentifier = ({ enodeHigh, enodeLow, ip, port }) => {
    return `${enodeHigh}_${enodeLow}_${ip}_${port}`;
};

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

export const identifierToParams = identifier => {
    const [enodeHigh, enodeLow, ip, port] = identifier.split("_");
    return {
        enodeHigh,
        enodeLow,
        ip,
        port,
        identifier
    };
};

export const identifierToEnodeHighAndLow = identifier => {
    if (identifier) {
        const [enodeHigh, enodeLow] = identifier.split("_");
        return `${enodeHigh}${enodeLow}`;
    }
    return "";
};
