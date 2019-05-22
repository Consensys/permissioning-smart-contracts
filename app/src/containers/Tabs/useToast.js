// Libs
import { useState } from "react";
// Hooks
import useTimeout from "./useTimeout";

export default () => {
    const { addTimeout } = useTimeout();
    const [toasts, setToasts] = useState([]);

    const openToast = (
        identifier,
        status,
        message,
        secondaryMessage,
        timeout = 5000
    ) => {
        const timeoutId = setTimeout(closeToast(identifier), timeout);
        closeToast(identifier)();
        setToasts(toasts => [
            ...toasts,
            { identifier, status, message, secondaryMessage }
        ]);
        addTimeout(timeoutId);
    };

    const updateToast = (
        targetedIdentifier,
        status,
        message,
        secondaryMessage,
        timeout = 5000
    ) => {
        setToasts(toasts => {
            const updatedToasts = [...toasts];
            const index = updatedToasts.findIndex(
                ({ identifier }) => identifier === targetedIdentifier
            );
            if (index !== -1) {
                updatedToasts.splice(index, 1);
            }
            return [
                ...updatedToasts,
                {
                    identifier: targetedIdentifier,
                    status,
                    message,
                    secondaryMessage
                }
            ];
        });
        const timeoutId = setTimeout(closeToast(targetedIdentifier), timeout);
        addTimeout(timeoutId);
    };

    const closeToast = targetedIdentifier => () => {
        setToasts(toasts => {
            const updatedToasts = [...toasts];
            const index = updatedToasts.findIndex(
                ({ identifier }) => identifier === targetedIdentifier
            );
            updatedToasts.splice(index, 1);
            return updatedToasts;
        });
    };

    return {
        toasts,
        openToast,
        updateToast,
        closeToast
    };
};
