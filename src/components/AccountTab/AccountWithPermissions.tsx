class AccountWithPermissions {
  address: string;
  canCreateContracts: boolean;
  status: string;
  isAdmin: boolean;

  constructor(address: string, canCreateContracts: boolean) {
    this.address = address;
    this.canCreateContracts = canCreateContracts;
    this.status = 'NEW';
    this.isAdmin = false;
    console.log('creating a new AccountWithPermissions' + address + 'ccc:' + canCreateContracts);
  }
}

export default AccountWithPermissions;
