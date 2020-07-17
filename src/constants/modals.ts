import { identifierToEnodeHighAndLow } from '../util/enodetools';

export type ModalDisplay = {
  heading: string;
  subHeading: string;
  label?: string;
  inputPlaceholder?: string;
  errorMessage?: string;
  submitText?: string;
};

export const addAdminDisplay: ModalDisplay = {
  submitText: 'Add Admin Account',
  errorMessage: 'Account address is not valid.',
  inputPlaceholder: 'Ex: 0xAc03BB73b6a9e108530AFf4Df5077c2B3D481e5A',
  label: 'Account Address',
  heading: 'Add Admin Account',
  subHeading: ''
};

export const removeAdminDisplay: (value: string | boolean) => ModalDisplay = value => ({
  heading: 'Are you sure?',
  subHeading: `Remove “${value}” as an admin account?`
});

export const addAccountDisplay: ModalDisplay = {
  submitText: 'Add Account',
  errorMessage: 'Account address is not valid.',
  inputPlaceholder: 'Ex: 0xAc03BB73b6a9e108530AFf4Df5077c2B3D481e5A',
  label: 'Account Address',
  heading: 'Add Account',
  subHeading: ''
};

export const removeAccountDisplay: (value: string | boolean) => ModalDisplay = value => ({
  heading: 'Are you sure?',
  subHeading: `Remove account “${value}”?`
});

export const addEnodeDisplay: ModalDisplay = {
  submitText: 'Add Node',
  errorMessage: 'Enode URL must include valid Node ID, IP address and Port.',
  inputPlaceholder:
    'Ex: enode://72b0d3ee9e86e072cca078b2588163bf8d9b85fa93923a31f4b97d13cf5280b3d32de9c13d4b7e3cc615d8c1347c97da760a689fac05d9ec80bda4517015ee78@127.0.0.1:30304',
  label: 'Enode URL',
  heading: 'Add Node',
  subHeading: ''
};

export const removeEnodeDisplay: (value: string) => ModalDisplay = value => ({
  heading: 'Are you sure?',
  subHeading: `Remove node “${identifierToEnodeHighAndLow(value)}”?`
});
