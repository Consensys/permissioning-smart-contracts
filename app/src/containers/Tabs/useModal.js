// Libs
import { useState } from "react";

export default () => {
    const [modals, setModals] = useState({
        add: false,
        remove: false,
        lock: false
    });

    const toggleModal = modal => value => {
        setModals(modals => ({
            ...modals,
            [modal]: value ? value : !modals[modal]
        }));
    };

    return { modals, toggleModal };
};
