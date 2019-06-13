const ipv4Prefix: string = '00000000000000000000ffff';

const hexToIp = (address: string) => {
    address = address.split('x')[1];
    return isIpv4(address) ? getIpv4(address) : getIpv6(address);
}

const isIpv4 = (address: string) => {
    return address.startsWith(ipv4Prefix) && parseInt(address.substring(ipv4Prefix.length), 16) <= 0xffffffff;
}

const getIpv4 = (address: string) => {
    return splitAddress(address.split(ipv4Prefix)[1], 2).map((hex) => {return parseInt(hex, 16)}).join('.');
}

const getIpv6 = (address: string) => {
    return splitAddress(address, 4).join(':');
}

const splitAddress = (address: string, digits: number) => {
    const bits: string[] = [];

    while(address.length >= digits) {
        bits.push(address.slice(0,digits));
        address = address.slice(digits);
    }
    return bits;
}

export default hexToIp;
