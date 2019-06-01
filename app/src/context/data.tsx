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

type Enode = {enodeHigh: string, enodeLow: string, identifier: string, ip: string, port: string};

type ContextType = {
    nodeWhitelist?: Enode[],
    setNodeWhitelist?: (enode: Enode[]) => void
}

const DataContext = createContext<ContextType>({});

/**
 * Provider for the data context that contains the whitelist
 * @param {Object} props Props given to the DataProvider
 * @return The provider with the following value:
 *  - nodeWhitelist: list of whiteliist enode from Node Rules contract
 *  - setNodeWhitelist: setter for the whitelist state
 */
export const DataProvider = (props: React.Props<{}>) => {
    const [nodeWhitelist, setNodeWhitelist] = useState<Enode[]>([]);

    const value = useMemo(() => ({ nodeWhitelist, setNodeWhitelist }), [
        nodeWhitelist,
        setNodeWhitelist
    ]);
    return <DataContext.Provider value={value} {...props} />;
};

/**
 * Fetch the appropriate data on chain and synchronize with it
 * @return {Object} Contains data of interest:
 *  - isReadOnly: Rules contract is lock or unlock,
 *  - nodeWhitelist: list of whitelist enode from Rules contract,
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

    const { nodeWhitelist, setNodeWhitelist } = context;

    const { userAddress } = drizzleReactHooks.useDrizzleState((drizzleState: any) => ({
        userAddress: drizzleState.accounts[0]
    }));

    const { drizzle, useCacheCall } = drizzleReactHooks.useDrizzle();

    const isReadOnly: boolean = useCacheCall("NodeRules", "isReadOnly");
    const nodeWhitelistSize: number = useCacheCall("NodeRules", "getSize");
    const admins: string[] = useCacheCall("Admin", "getAdmins");

    const { getByIndex } = drizzle.contracts.NodeRules.methods;

    useEffect(() => {
        const promises = [];
        for (let index = 0; index < nodeWhitelistSize; index++) {
            promises.push(getByIndex(index).call());
        }
        Promise.all(promises).then(responses => {
            const updatedNodeWhitelist = responses.map(
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
            setNodeWhitelist!(updatedNodeWhitelist);
        });
    }, [nodeWhitelistSize, setNodeWhitelist, getByIndex]);

    const dataReady = useMemo(
        () =>
            typeof isReadOnly === "boolean" &&
            Array.isArray(admins) &&
            Array.isArray(nodeWhitelist),
        [isReadOnly, admins, nodeWhitelist]
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

    const formattedNodeWhitelist = useMemo(() => {
        return nodeWhitelist
            ? nodeWhitelist
                  .map(enode => ({ ...enode, status: "active" }))
                  .reverse()
            : undefined;
    }, [nodeWhitelist]);

    return {
        userAddress,
        dataReady,
        isAdmin,
        isReadOnly,
        admins: formattedAdmins,
        nodeWhitelist: formattedNodeWhitelist
    };
};
