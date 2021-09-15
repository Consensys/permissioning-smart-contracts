// Libs
import { useState, useCallback } from 'react';
import AccountWithPermissions from '../../components/AccountTab/AccountWithPermissions';

export default () => {
  const [modals, setModals] = useState<{
    add: boolean;
    remove: boolean | string;
    modify: boolean | string | AccountWithPermissions;
    lock: boolean;
  }>({
    add: false,
    remove: '',
    modify: false,
    lock: false
  });

  const toggleModal = useCallback(
    (modal: 'add' | 'remove' | 'modify' | 'lock') => (value?: AccountWithPermissions | string | boolean) => {
      console.log('toggleModal ' + modal + '=' + value);
      setModals(modals => ({
        ...modals,
        [modal]: value ? value : !modals[modal]
      }));
    },
    [setModals]
  );

  return { modals, toggleModal };
};
