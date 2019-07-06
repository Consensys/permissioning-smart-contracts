import { Provider } from 'ethers/providers';
import { ethers } from 'ethers';
import Web3 from 'web3';

let provider: Provider | null = null;
let web3: Web3 | null = null;

const web3Factory = async () => {
  if (web3) return web3;
  web3 = new Web3(Web3.givenProvider);
  return web3;
};

const providerFactory = async () => {
  if (provider) return provider;

  const web3 = await web3Factory();
  provider = new ethers.providers.Web3Provider(web3.currentProvider);

  return provider;
};

export default providerFactory;
