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
  errorMessage: 'Account address is not correct.',
  inputPlaceholder: 'Ex: 0xAc03BB73b6a9e108530AFf4Df5077c2B3D481e5A',
  label: 'Account Address',
  heading: 'Add Admin Account',
  subHeading: 'Admin accounts can...'
};

export const removeAdminDisplay: (value: string | boolean) => ModalDisplay = value => ({
  heading: 'Are you sure?',
  subHeading: `Remove “${value}” as an admin account?`
});

export const addAccountDisplay: ModalDisplay = {
  submitText: 'Add Whitelisted Account',
  errorMessage: 'Account address is not correct.',
  inputPlaceholder: 'Ex: 0xAc03BB73b6a9e108530AFf4Df5077c2B3D481e5A',
  label: 'Account Address',
  heading: 'Add Whitelisted Account',
  subHeading: 'Whitelisted accounts may submit transactions on the network.'
};

export const removeAccountDisplay: (value: string | boolean) => ModalDisplay = value => ({
  heading: 'Are you sure?',
  subHeading: `Remove “${value}” as a whitelisted account?`
});

export const addEnodeDisplay: ModalDisplay = {
  submitText: 'Add Whitelisted Node',
  errorMessage: 'Enode URL must include Address, IP address and Port.',
  inputPlaceholder:
    'Ex: enode://72b0d3ee9e86e072cca078b2588163bf8d9b85fa93923a31f4b97d13cf5280b3d32de9c13d4b7e3cc615d8c1347c97da760a689fac05d9ec80bda4517015ee78@127.0.0.1:30304',
  label: 'Enode URL',
  heading: 'Add Whitelisted Node',
  subHeading: 'Nodes can connect to each other if they are both whitelisted. See formatting details here.'
};

export const removeEnodeDisplay: (value: string) => ModalDisplay = value => ({
  heading: 'Are you sure?',
  subHeading: `Remove “${identifierToEnodeHighAndLow(value)}” as a whitelisted node?`
});
