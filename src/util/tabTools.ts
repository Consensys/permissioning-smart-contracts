// Constants
import {
    FAIL
} from "../constants/transactions";

export const errorToast = (
    error: Error,
    value: string,
    openToast: (
        identifier: string,
        status: string,
        message: string) => void,
    defaultToast: () => void) => {
    if (error.message.includes("MetaMask Tx Signature: User denied transaction signature.")) {
        openToast(
            value,
            FAIL,
            "User rejected MetaMask transaction."
        );
    } else {
        defaultToast();
    }
}