// Libs
import React from "react";
// Styles
import styles from "./styles.module.scss";

const EmptyRow = () => (
    <tr>
        <td colSpan="5" className={styles.emptyLine}>
            No nodes have been whitelisted.
        </td>
    </tr>
);

export default EmptyRow;
