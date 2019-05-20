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

export const DataProvider = props => {
    const [whitelist, setWhitelist] = useState();

    const value = useMemo(() => ({ whitelist, setWhitelist }), [
        whitelist,
        setWhitelist
    ]);
    return <DataContext.Provider value={value} {...props} />;
};

/**
 * Fetch the appropriate data on chain and synchronize with it
 * @return {[Object]} Contains data of interest:
 *  - isReadOnly (Rules contract),
 *  - whitelist (Rules contract)
 *  - admins (Admin contract)
 *  - dataReady (above data correctly fetched)
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

    const { getByIndex } = drizzle.contracts.Rules.methods;

    const isReadOnly = useCacheCall("Rules", "isReadOnly");
    const whitelistSize = useCacheCall("Rules", "getSize");
    const admins = useCacheCall("Admin", "getAdmins");

    useEffect(() => {
        const promises = [];
        for (let index = 0; index < whitelistSize; index++) {
            promises.push(getByIndex(index).call());
        }
        Promise.all(promises).then(responses => {
            const whitelist = responses.map(
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
            setWhitelist(whitelist);
        });
    }, [whitelistSize, setWhitelist, getByIndex]);

    const dataReady =
        isReadOnly !== undefined &&
        admins !== undefined &&
        whitelist !== undefined;

    return {
        userAddress,
        dataReady,
        isReadOnly,
        admins,
        whitelist
    };
};
