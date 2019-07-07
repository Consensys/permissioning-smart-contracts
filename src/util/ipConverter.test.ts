import hexToIp from './ipConverter';

it('converts 127.0.0.1 as hex input to ipv4 correctly', () => {
  const hex: string = '0x00000000000000000000ffff7f000001';
  const expected: string = '127.0.0.1';
  const result = hexToIp(hex);
  expect(result).toEqual(expected);
});

it('converts 250.166.72.13 as hex input to ipv4 correctly', () => {
  const hex: string = '0x00000000000000000000fffffaa6480d';
  const expected: string = '250.166.72.13';
  const result = hexToIp(hex);
  expect(result).toEqual(expected);
});

it('converts 2001:0db8:85a3:0000:0000:8a2e:0370:7334 as hex input to ipv6 correctly', () => {
  const hex: string = '0x20010db885a3000000008a2e03707334';
  const expected: string = '2001:0db8:85a3:0000:0000:8a2e:0370:7334';
  const result = hexToIp(hex);
  expect(result).toEqual(expected);
});
