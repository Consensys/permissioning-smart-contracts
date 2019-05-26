// Libs
import { useState, useEffect, useCallback } from "react";

/**
 * Allows to clear timeouts when component unmounts
 * @return {Object} Contains:
 *  - addTimeout: Function that adds a timeoutId to be cleared
 */
export default () => {
    const [timeouts, setTimeouts] = useState([]);

    useEffect(
        () => () => {
            timeouts.forEach(timeoutId => clearTimeout(timeoutId));
        },
        [timeouts]
    );

    const addTimeout = useCallback(
        timeoutId => setTimeouts(timeouts => [...timeouts, timeoutId]),
        [setTimeouts]
    );

    return { addTimeout };
};
