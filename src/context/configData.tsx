import React, { createContext , useContext } from "react"
import { Config } from "../util/configLoader"


type ContextType = {
  config: Config
} | undefined;

const ConfigDataContext = createContext<ContextType>(undefined)

export const ConfigDataProvider: React.FC<{config: Config}> = (props) => {
  return <ConfigDataContext.Provider value={{config: props.config}} {...props}/>
}

export const useConfig = () => {
  const context = useContext(ConfigDataContext)

  if (!context) {
    throw new Error ("useConfigData must be used within a ConfigDataProvider")
  }

  return context.config
}
