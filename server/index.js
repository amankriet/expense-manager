import express from "express"
import cors from "cors"
import passport from "passport"
import "./config/passport.js"
import path from "path"
import fs from "fs"
import cookieParser from "cookie-parser"
import logger from "./middlewares/logger.js"
import { ERROR_LOGS_FILE } from "./utils/common.js";
import { ensureDatabaseConnection } from "./middlewares/databaseConnection.js"

const __dirname = path.resolve()

const app = express()

const whiteList = [
    'http://localhost:3001',
    'http://localhost:3000',
    'http://localhost:5173',
    'https://www.amankriet.com',
    'https://amankriet.com',
]

app.use(cookieParser())
app.use(cors({
    origin: whiteList,
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())
app.use(ensureDatabaseConnection)

// connect to the "/routes" directory
const routersPath = path.join(__dirname, "routes")

try {
    // read all files in the "/routes" directory
    for (const file of fs.readdirSync(routersPath)) {
        if (file.endsWith("js")) {
            // dynamically import the router module
            const routerModule = await import(path.join(routersPath, file))
            // note: using routerModule.default because that's where the default exported router is.
            // Or we can use routerModule.`export router name` if it's not a default export and a named export
            const router = routerModule.default

            // noinspection JSCheckFunctionSignatures
            app.use(path.join("/v1", file.split(".")[0]), router)
        }
    }
    // check res.http file for all available routes
} catch (err) {
    console.error(err)
    logger(`${err.name}: ${err.message}`, ERROR_LOGS_FILE)
}

app.get("/", (req, res) => {
    return res.send('Expense Manager')
})

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

export default app;