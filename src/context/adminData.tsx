// Libs
import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { drizzleReactHooks } from "drizzle-react";

type ContextType = {
    admins?: string[],
    setAdmins?: (admins: string[]) => void
}

const AdminDataContext = createContext<ContextType>({})

export const AdminDataProvider: React.FC = (props: React.Props<{}>) => {
    const [admins, setAdmins] = useState<string[]>([])
    const value = useMemo(() => ({ admins, setAdmins }), [
        admins,
        setAdmins
    ])
    return <AdminDataContext.Provider value={value} {...props} />
}

export const useAdminData = () => {
    const context = useContext(AdminDataContext)

    if (!context) {
        throw new Error("useAccountData must be used within a AccountDataProvider.")
    }

    const { admins, setAdmins } = context

    const { userAddress } = drizzleReactHooks.useDrizzleState((drizzleState: any) => ({
        userAddress: drizzleState.accounts[0]
    }));

    const { useCacheCall } = drizzleReactHooks.useDrizzle();    
    const adminList: string[] = useCacheCall("Admin", "getAdmins");

    // const { getAdmins } = drizzle.contracts.Admin.methods;

    useEffect(() => {
        // getAdmins().call().then((adminLists: string[]) => {setAdmins!(adminLists);});
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