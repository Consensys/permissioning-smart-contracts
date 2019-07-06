/**
 * Given a list of contracts, return the list of common networks
 * @param  {[Object]} contractArray List of contracts
 * @return {[number]}               List of common networks
 */
export const getAllowedNetworks = (contractArray: { networks: { [networkId: number]: any } }[]) => {
  const numberOfContracts = contractArray.length;

  const occurences: { [networkId: string]: number } = {};

  contractArray.forEach(({ networks }) => {
    Object.keys(networks).forEach(networkId => {
      if (networkId in occurences) {
        occurences[networkId]++;
      } else {
        occurences[networkId] = 1;
      }
    });
  });

  const allowedNetworks: number[] = [];

  Object.entries(occurences).forEach(([networkId, occurence]) => {
    if (occurence === numberOfContracts) {
      allowedNetworks.push(Number(networkId));
    }
  });

  return allowedNetworks;
};
