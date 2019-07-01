export type Config = {}

const loadConfig = async (): Promise<Config> => {
  console.log("loading config")

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
