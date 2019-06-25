// Libs
import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { drizzleReactHooks } from "drizzle-react";

type ContextType = {
    admins?: string[],
    setAdmins?: (admins: string[]) => void
}

const AdminDataContext = createContext<ContextType>({})

/**
 * Provider for the data context that contains the Admin whitelist
 * @param {Object} props Props given to the AdminDataProvider
 * @return The provider with the following value:
 *  - admins: list of Admin accounts from Admin Rules contract
 *  - setAdmins: setter for the Admin list state
 */
export const AdminDataProvider: React.FC = (props: React.Props<{}>) => {
    const [admins, setAdmins] = useState<string[]>([])
    const value = useMemo(() => ({ admins, setAdmins }), [
        admins,
        setAdmins
    ])
    return <AdminDataContext.Provider value={value} {...props} />
}

/**
 * Fetch the appropriate Admin data on chain and synchronize with it
 * @return {Object} Contains data of interest:
  *  - dataReady: true if Admin whitelist has been correctly fetched,
 *  false otherwise
 *  - userAddress: Address of the user
 *  - isAdmin: user in an Admin,
 *  - whitelist: list of whitelist nodes from Node contract,
 */
export const useAdminData = () => {
    const context = useContext(AdminDataContext)

    if (!context) {
        throw new Error("useAdminData must be used within an AdminDataProvider.")
    }

    const { admins, setAdmins } = context

    const { userAddress } = drizzleReactHooks.useDrizzleState((drizzleState: any) => ({
        userAddress: drizzleState.accounts[0]
    }));

    const { useCacheCall } = drizzleReactHooks.useDrizzle();    
    const adminList: string[] = useCacheCall("Admin", "getAdmins");

    useEffect(() => {
        setAdmins!(adminList || [])
        }, [adminList, setAdmins]
    )
    

    const dataReady = useMemo(
        () =>
            Array.isArray(admins),
            [admins]
    );

    const isAdmin = useMemo(
        () => (dataReady && admins ? admins.includes(userAddress) : false),
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

    return {
        dataReady,
        userAddress,
        isAdmin,
        admins: formattedAdmins
    }
}