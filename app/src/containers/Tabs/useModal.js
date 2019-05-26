// Libs
import { useState, useCallback } from "react";

export default () => {
    const [modals, setModals] = useState({
        add: false,
        remove: false,
        lock: false
    });

    const toggleModal = useCallback(
        modal => value => {
            setModals(modals => ({
                ...modals,
                [modal]: value ? value : !modals[modal]
            }));
        },
        [setModals]
    );

    return { modals, toggleModal };
};
