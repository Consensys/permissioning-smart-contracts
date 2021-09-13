// Libs
import { useState, useCallback } from 'react';

export default () => {
  const [modals, setModals] = useState<{
    add: boolean;
    remove: string;
    modify: string;
    lock: boolean;
  }>({
    add: false,
    remove: '',
    modify: '',
    lock: false
  });

  const toggleModal = useCallback(
    (modal: 'add' | 'remove' | 'modify' | 'lock') => (value?: string | boolean) => {
      setModals(modals => ({
        ...modals,
        [modal]: value ? value : !modals[modal]
      }));
    },
    [setModals]
  );

  return { modals, toggleModal };
};
