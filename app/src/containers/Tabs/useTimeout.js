// Libs
import { useState, useEffect } from "react";

export default () => {
    const [timeouts, setTimeouts] = useState([]);

    useEffect(
        () => () => {
            timeouts.forEach(timeoutId => clearTimeout(timeoutId));
        },
        [timeouts]
    );

    const addTimeout = timeoutId =>
        setTimeouts(timeouts => [...timeouts, timeoutId]);

    return { timeouts, addTimeout };
};
