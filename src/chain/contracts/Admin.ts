import { Contract } from 'ethers';
import AdminAbi from '../abis/Admin.json';
import { AccountIngress } from '../@types/AccountIngress';
import { NodeIngress } from '../@types/NodeIngress';
import { Admin } from '../@types/Admin';

let instance: Admin | null = null;

export default async (ingressInstance: AccountIngress | NodeIngress) => {
  if (instance) return instance;

  const adminAddress = await ingressInstance.functions.getContractAddress('ADMIN');

  instance = new Contract(adminAddress, AdminAbi.abi, ingressInstance.provider) as Admin;
  return instance;
};
