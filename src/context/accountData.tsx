import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useMemo
} from "react";
import { drizzleReactHooks } from "drizzle-react";

type Account = {address: string}

type ContextType = {
    accountWhitelist?: Account[],
    setAccountWhitelist?: (account: Account[]) => void
}

const AccountDataContext = createContext<ContextType>({})

/**
 * Provider for the data context that contains the whitelist
 * @param {Object} props Props given to the DataProvider
 * @return The provider with the following value:
 *  - nodeWhitelist: list of whiteliist enode from Node Rules contract
 *  - setNodeWhitelist: setter for the whitelist state
 */
export const AccountDataProvider: React.FC = (props: React.Props<{}>) => {
    const [accountWhitelist, setAccountWhitelist] = useState<Account[]>([])
    const value = useMemo(() => ({ accountWhitelist, setAccountWhitelist }), [
        accountWhitelist,
        setAccountWhitelist
    ])
    return <AccountDataContext.Provider value={value} {...props} />
}

/**
 * Fetch the appropriate data on chain and synchronize with it
 * @return {Object} Contains data of interest:
 *  - admins: list of admin address from Admin contract,
 *  - dataReady: true if isReadOnly, whitelist and admins are correctly fetched,
 *  false otherwise
 *  - userAddress: Address of the user
 *  - isAdmin: true if address of the user is includes in the admin list
 *  - node: Object containing node relevant data
 *    - isReadOnly: Rules contract is lock or unlock,
 *    - whitelist: list of whitelist enode from Rules contract,
 */
export const useAccountData = () => {
    const context = useContext(AccountDataContext)

    if (!context) {
        throw new Error("useAccountData must be used within a AccountDataProvider.")
    }

    const { accountWhitelist, setAccountWhitelist } = context
    const { drizzle, useCacheCall } = drizzleReactHooks.useDrizzle()
    const accountIsReadOnly: boolean = useCacheCall("AccountRules", "isReadOnly")
    const accountWhitelistSize: number = useCacheCall("AccountRules", "getSize")
    const { getByIndex: getAccountByIndex } = drizzle.contracts.AccountRules.methods
    const { userAddress } = drizzleReactHooks.useDrizzleState((drizzleState: any) => ({
        userAddress: drizzleState.accounts[0]
    }));

    useEffect(() => {
        const promises = [];
        for (let index = 0; index < accountWhitelistSize; index++) {
            promises.push(getAccountByIndex(index).call());
        }
        Promise.all(promises).then(responses => {
            const updatedAccountWhitelist = responses.map((address: string) => ({address}));
            setAccountWhitelist!(updatedAccountWhitelist);
        })
    }, [accountWhitelistSize, setAccountWhitelist, getAccountByIndex])

    const dataReady = useMemo(
        () =>
            typeof accountIsReadOnly === "boolean" &&
            Array.isArray(accountWhitelist),
        [accountIsReadOnly, accountWhitelist]
    )

    const formattedAccountWhitelist = useMemo(() => {
        return accountWhitelist
            ? accountWhitelist
                  .map(account => ({ ...account, status: "active" }))
                  .reverse()
            : undefined
    }, [accountWhitelist])

    return {
        userAddress,
        dataReady,
        whitelist: formattedAccountWhitelist,
        isReadOnly: accountIsReadOnly
    }
}