export type Config = {
  AccountRulesAddress?: string
}

const loadConfig = async (): Promise<Config> => {
  // production loader
  if (process.env.NODE_ENV === "production") {
    const response = await fetch("config.json")

    if (response.ok) {
      return response.json()
    } else {
      throw new Error("Failed to load config file")
    }
  // development defaults
  } else {
    return {
    }
  }
}

export const configPromise = loadConfig()
