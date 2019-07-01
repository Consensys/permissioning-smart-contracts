export type Config = {
  AccountRulesAddress?: string
}

const loadConfig = async (): Promise<Config> => {
  // production loader
  if (process.env.NODE_ENV === "production") {
    const response = await fetch("config.json")

    if (response.ok) {
      return response.json().catch((reason: any) => {
        console.log("config parsing failed with error:", reason)
        return {}
      })
    } else {
      console.log("Failed to load config file")
      return {}
    }
  // development defaults
  } else {
    return {
    }
  }
}

export const configPromise = loadConfig()
