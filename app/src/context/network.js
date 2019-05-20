// Libs
import React, {
    useContext,
    useEffect,
    useState,
    createContext,
    useMemo
} from "react";
import { Drizzle, generateStore } from "drizzle";
import { drizzleReactHooks } from "drizzle-react";
// Constants
import drizzleOptions from "../drizzleOptions";
import Rules from "../contracts/Rules.json";
import Admin from "../contracts/Admin.json";
// Utils
import { getAllowedNetworks } from "../util/contracts";

const drizzleStore = generateStore(drizzleOptions);
const drizzle = new Drizzle(drizzleOptions, drizzleStore);

const NetworkContext = createContext();

export const NetworkProvider = props => {
    const [isCorrectNetwork, setIsCorrectNetwork] = useState(null);
    const [web3Initialized, setWeb3Initialized] = useState(false);

    const value = useMemo(
        () => ({
            isCorrectNetwork,
            setIsCorrectNetwork,
            web3Initialized,
            setWeb3Initialized
        }),
        [
            isCorrectNetwork,
            setIsCorrectNetwork,
            web3Initialized,
            setWeb3Initialized
        ]
    );

    return (
        <drizzleReactHooks.DrizzleProvider drizzle={drizzle}>
            <NetworkContext.Provider value={value} {...props} />
        </drizzleReactHooks.DrizzleProvider>
    );
};

export const useNetwork = () => {
    const {
        isCorrectNetwork,
        setIsCorrectNetwork,
        web3Initialized,
        setWeb3Initialized
    } = useContext(NetworkContext);

    const { networkId, status } = drizzleReactHooks.useDrizzleState(
        drizzleState => ({
            status: drizzleState.web3.status,
            networkId: drizzleState.web3.networkId
        })
    );

    useEffect(() => {
        if (status === "initialized") {
            const allowedNetworks = getAllowedNetworks([Rules, Admin]);
            if (networkId) {
                const isCorrectNetwork = allowedNetworks.includes(networkId);
                setIsCorrectNetwork(isCorrectNetwork);
            }
            setWeb3Initialized(true);
        }
    }, [networkId, setIsCorrectNetwork, status, setWeb3Initialized]);

    return {
        isCorrectNetwork,
        networkId,
        web3Initialized
    };
};
