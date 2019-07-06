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
import NodeRules from "../chain/abis/NodeRules.json";
import AccountRules from "../chain/abis/AccountRules.json";
import Admin from "../chain/abis/Admin.json";
// Utils
import { getAllowedNetworks } from "../util/contracts";
import { useConfig } from "../context/configData";

type ContextType = {
  isCorrectNetwork?: boolean
  setIsCorrectNetwork: React.Dispatch<React.SetStateAction<boolean | undefined>>
  web3Initialized: boolean
  setWeb3Initialized: React.Dispatch<React.SetStateAction<boolean>>
} | undefined

const NetworkContext = createContext<ContextType>(undefined);


/**
 * Provider for the network context that contains informations about the
 * blockchain provider
 * @param {Object} props Props given to the NetworkProvider
 * @return The provider with the following value:
 *  - isCorrectNetwork: true if the detected network is one of the allowed
 *  networks by the contracts, false if it is not, null if there is no detected
 *  network
 *  - setIsCorrectNetwork: setter of isCorrectNetwork
 *  - web3Initialized: true if Drizzle has initialized web3, false otherwise
 *  - setWeb3Initialized: setter for web3Initialized
 */
export const NetworkProvider: React.FC<{}> = props => {
    const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean | undefined>(undefined);
    const [web3Initialized, setWeb3Initialized] = useState<boolean>(false);

    const config = useConfig();
    const [drizzle] = useState<Drizzle>(() => {
        const options = drizzleOptions(config);

        const drizzleStore = generateStore(options);
        return new Drizzle(options, drizzleStore);
    })

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

/**
 * Synchronize with the blockchain network
 * @return {Object} The network informations:
 *  - isCorrectNetwork: true if the detected network is one of the allowed
 *  networks by the contracts, false if it is not, null if there is no detected
 *  network,
 *  - networkId: The id of the network,
 *  - web3Initialized: true if Drizzle has initialized web3, false otherwise
 */
export const useNetwork = () => {
    const context = useContext(NetworkContext);
    if (!context) {
        throw new Error("useData must be used within a DataProvider.");
    }

    const {
        isCorrectNetwork,
        setIsCorrectNetwork,
        web3Initialized,
        setWeb3Initialized
    } = context;

    const { networkId, status } = drizzleReactHooks.useDrizzleState(
        (drizzleState: any) => ({
            status: drizzleState.web3.status,
            networkId: drizzleState.web3.networkId
        })
    );

    useEffect(() => {
        if (status === "initialized") {
            const allowedNetworks = getAllowedNetworks([
                AccountRules,
                NodeRules,
                Admin
            ]);
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
