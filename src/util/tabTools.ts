// Libs
import idx from 'idx';
// Constants
import { FAIL } from "../constants/transactions";

type W3Error = {
    message: string,
    stack: string
}

export const errorToast = (error: W3Error, value: string, openToast: (identifier: string, status: string, message: string) => void, defaultToast: () => void) => {
    const message = idx(error, _ => _.message);
    if (message && message.includes("MetaMask Tx Signature: User denied transaction signature.")) {
        openToast(
            value,
            FAIL,
            "User rejected MetaMask transaction."
        );
    } else {
        defaultToast();
    }
}    