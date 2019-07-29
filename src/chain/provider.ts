import { Provider, AsyncSendable } from 'ethers/providers';
import { ethers, Signer } from 'ethers';
import Web3 from 'web3';

let provider: Provider | Signer | undefined = undefined;
let web3: Web3 | undefined = undefined;
declare let window: any;

const web3Factory = async () => {
  if (web3) return web3;

  if (window.ethereum) {
    await window.ethereum.enable();
  }

  web3 = new Web3(Web3.givenProvider);
  return web3;
};

export const providerFactory = async () => {
  if (provider) return provider;

  const web3 = await web3Factory();
  provider = new ethers.providers.Web3Provider(web3.currentProvider as AsyncSendable).getSigner();

  return provider;
};
