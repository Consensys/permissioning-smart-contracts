// Libs
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useMemo
} from "react";
import { drizzleReactHooks } from "drizzle-react";
// Utils
import { paramsToIdentifier } from "../util/enodetools";

const DataContext = createContext();

/**
 * Provider for the data context that contains the whitelist
 * @param {Object} props Props given to the DataProvider
 * @return The provider with the following value:
 *  - whitelist: list of whiteliist enode from Rules contract
 *  - setWhitelist: setter for the whitelist state
 */
export const DataProvider = props => {
    const [whitelist, setWhitelist] = useState([]);

    const value = useMemo(() => ({ whitelist, setWhitelist }), [
        whitelist,
        setWhitelist
    ]);
    return <DataContext.Provider value={value} {...props} />;
};

/**
 * Fetch the appropriate data on chain and synchronize with it
 * @return {Object} Contains data of interest:
 *  - isReadOnly: Rules contract is lock or unlock,
 *  - whitelist: list of whitelist enode from Rules contract,
 *  - admins: list of admin address from Admin contract,
 *  - dataReady: true if isReadOnly, whitelist and admins are correctly fetched,
 *  false otherwise
 *  - userAddress: Address of the user
 *  - isAdmin: true if address of the user is includes in the admin list
 */
export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("useData must be used within a DataProvider.");
    }

    const { whitelist, setWhitelist } = context;

    const { userAddress } = drizzleReactHooks.useDrizzleState(drizzleState => ({
        userAddress: drizzleState.accounts[0]
    }));

    const { drizzle, useCacheCall } = drizzleReactHooks.useDrizzle();

    const isReadOnly = useCacheCall("NodeRules", "isReadOnly");
    const whitelistSize = useCacheCall("NodeRules", "getSize");
    const admins = useCacheCall("Admin", "getAdmins");

    const { getByIndex } = drizzle.contracts.NodeRules.methods;

    useEffect(() => {
        const promises = [];
        for (let index = 0; index < whitelistSize; index++) {
            promises.push(getByIndex(index).call());
        }
        Promise.all(promises).then(responses => {
            const updatedWhitelist = responses.map(
                ({ enodeHigh, enodeLow, ip, port }) => ({
                    enodeHigh,
                    enodeLow,
                    ip,
                    port,
                    identifier: paramsToIdentifier({
                        enodeHigh,
                        enodeLow,
                        ip,
                        port
                    })
                })
            );
            setWhitelist(updatedWhitelist);
        });
    }, [whitelistSize, setWhitelist, getByIndex]);

    const dataReady = useMemo(
        () =>
            typeof isReadOnly === "boolean" &&
            Array.isArray(admins) &&
            Array.isArray(whitelist),
        [isReadOnly, admins, whitelist]
    );

    const isAdmin = useMemo(
        () => (dataReady ? admins.includes(userAddress) : false),
        [dataReady, admins, userAddress]
    );

    const formattedAdmins = useMemo(() => {
        return admins
            ? admins
                  .map(address => ({
                      address,
                      identifier: address,
                      status: "active"
                  }))
                  .reverse()
            : undefined;
    }, [admins]);

    const formattedWhitelist = useMemo(() => {
        return whitelist
            ? whitelist.map(enode => ({ ...enode, status: "active" })).reverse()
            : undefined;
    }, [whitelist]);

    return {
        userAddress,
        dataReady,
        isAdmin,
        isReadOnly,
        admins: formattedAdmins,
        whitelist: formattedWhitelist
    };
};
