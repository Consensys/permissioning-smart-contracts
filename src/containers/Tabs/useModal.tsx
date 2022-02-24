// Libs
import { useState, useCallback } from 'react';

export default () => {
  const [modals, setModals] = useState<{
    add: boolean;
    remove: string;
    lock: boolean;
  }>({
    add: false,
    remove: '',
    lock: false
  });

  const toggleModal = useCallback(
    (modal: 'add' | 'remove' | 'lock') => (value?: string | boolean) => {
   
      setModals(modals => ({
        ...modals,
        [modal]: value ? value : !modals[modal]
      }));
    },
    [setModals]
  );

  return { modals, toggleModal };
};
