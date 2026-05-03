import dotenv from "dotenv"
import fs from "fs"
import path from "path"

const rawEnv = process.env.NODE_ENV || "local"
const envName = rawEnv.trim().toLowerCase()

const envFiles = {
    local: ".env.local",
    development: ".env.development",
    test: ".env.test",
    production: ".env.production",
}

const envFilename = envFiles[envName] || ".env.local"
const envPath = path.resolve(process.cwd(), envFilename)
const fallbackPath = path.resolve(process.cwd(), ".env")

let loaded = false

if (fs.existsSync(envPath)) {
    const result = dotenv.config({ path: envPath })
    if (result.error) {
        throw result.error
    }
    loaded = true
    console.log(`Loaded environment from ${envFilename}`)
} else if (fs.existsSync(fallbackPath)) {
    const result = dotenv.config({ path: fallbackPath })
    if (result.error) {
        throw result.error
    }
    loaded = true
    console.log("Loaded environment from .env")
}

if (!loaded && !process.env.DATABASE_URL) {
    console.warn(
        `No environment file found for NODE_ENV=${envName}. Expected ${envFilename} or .env, and no DATABASE_URL was provided from the environment.`
    )
}
