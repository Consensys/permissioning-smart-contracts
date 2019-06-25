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
 * Provider for the data context that contains the node whitelist
 * @param {Object} props Props given to the NodeDataProvider
 * @return The provider with the following value:
 *  - nodeWhitelist: list of whiteliist enode from Node Rules contract
 *  - setNodeWhitelist: setter for the whitelist state
 */
export const NodeDataProvider: React.FC = (props: React.Props<{}>) => {
    const [nodeWhitelist, setNodeWhitelist] = useState<Enode[]>([]);

    const value = useMemo(() => ({ nodeWhitelist, setNodeWhitelist }), [
        nodeWhitelist,
        setNodeWhitelist
    ]);
    return <DataContext.Provider value={value} {...props} />;
};

/**
 * Fetch the appropriate node data on chain and synchronize with it
 * @return {Object} Contains data of interest:
  *  - dataReady: true if isReadOnly and node whitelist are correctly fetched,
 *  false otherwise
 *  - userAddress: Address of the user
 *  - isReadOnly: Node contract is lock or unlock,
 *  - whitelist: list of whitelist nodes from Node contract,
 */
export const useNodeData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("useNodeData must be used within a NodeDataProvider.");
    }

    const { nodeWhitelist, setNodeWhitelist } = context;
    const { drizzle, useCacheCall } = drizzleReactHooks.useDrizzle();    
    const nodeWhitelistSize: number = useCacheCall("NodeRules", "getSize");
    const { getByIndex: getNodeByIndex } = drizzle.contracts.NodeRules.methods;    
    const nodeIsReadOnly: boolean = useCacheCall("NodeRules", "isReadOnly");
    const { userAddress } = drizzleReactHooks.useDrizzleState((drizzleState: any) => ({
        userAddress: drizzleState.accounts[0]
    }));

    useEffect(() => {
        const promises = [];
        for (let index = 0; index < nodeWhitelistSize; index++) {
            promises.push(getNodeByIndex(index).call());
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
    }, [nodeWhitelistSize, setNodeWhitelist, getNodeByIndex]);    

    const formattedNodeWhitelist = useMemo(() => {
        return nodeWhitelist
            ? nodeWhitelist
                  .map(enode => ({ ...enode, status: "active" }))
                  .reverse()
            : undefined;
    }, [nodeWhitelist]);    
    
    const dataReady = useMemo(
        () =>
            typeof nodeIsReadOnly === "boolean" &&
            Array.isArray(nodeWhitelist),
        [nodeIsReadOnly, nodeWhitelist]
    )

    return {
        userAddress,
        dataReady,
        whitelist: formattedNodeWhitelist,
        isReadOnly: nodeIsReadOnly
    }
}