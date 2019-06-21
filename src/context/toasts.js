// Libs
import React, {
    useContext,
    useState,
    createContext,
    useMemo,
    useCallback
} from "react";
// Hooks
import useTimeout from "./useTimeout";

const ToastContext = createContext();

/**
 * Provider for the current state of the toasts
 * @param {Object} props Props given to the ToastProvider
 * @return The provider with the following value:
 *  - toasts: Array of opened toasts
 *  - setToasts: setter of toasts
 */
export const ToastProvider = props => {
    const [toasts, setToasts] = useState([]);

    const value = useMemo(() => ({ toasts, setToasts }), [toasts, setToasts]);

    return <ToastContext.Provider value={value} {...props} />;
};

/**
 * Synchronize with the toasts state
 * @return {Object} The toasts informations and the associated setters:
 *  - toasts: Array of opened toasts
 *  - openToast: Function that creates a toast and deletes it later
 *  - updateToast: Function that updates a toast
 *  - closeToast: Function that deletes the toast
 */
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a DataProvider.");
    }

    const { addTimeout } = useTimeout();

    const { toasts, setToasts } = context;

    const closeToast = useCallback(
        targetedIdentifier => () => {
            setToasts(toasts => {
                const updatedToasts = [...toasts];
                const index = updatedToasts.findIndex(
                    ({ identifier }) => identifier === targetedIdentifier
                );
                updatedToasts.splice(index, 1);
                return updatedToasts;
            });
        },
        [setToasts]
    );

    const openToast = useCallback(
        (identifier, status, message, secondaryMessage, timeout = 5000) => {
            const timeoutId = setTimeout(closeToast(identifier), timeout);
            closeToast(identifier)();
            setToasts(toasts => [
                ...toasts,
                { identifier, status, message, secondaryMessage }
            ]);
            addTimeout(timeoutId);
        },
        [addTimeout, closeToast, setToasts]
    );

    const updateToast = useCallback(
        (
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
            const timeoutId = setTimeout(
                closeToast(targetedIdentifier),
                timeout
            );
            addTimeout(timeoutId);
        },
        [addTimeout, closeToast, setToasts]
    );

    return {
        toasts,
        openToast,
        updateToast,
        closeToast
    };
};
