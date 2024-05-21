import express from "express"
import cors from "cors"
import "./config/database.js"
import passport from "passport"
import "./config/passport.js"
import path from "path"
import fs from "fs"
import cookieParser from "cookie-parser"
import logger from "./middlewares/logger.js"
import {ERROR_LOGS_FILE} from "./utils/common.js";

const __dirname = path.resolve()

const app = express()

const whiteList = ['http://localhost:3001', 'http://localhost:3000']
const corsOptionsDelegate = function (req, callback) {
    let corsOptions;
    if (whiteList.indexOf(req.header('Origin')) !== -1 || !req.header('Origin')) {
        corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
    } else {
        corsOptions = { origin: false } // disable CORS for this request
    }
    console.log('corsOption',corsOptions)
    callback(null, corsOptions) // callback expects two parameters: error and options
}

app.use(cors(corsOptionsDelegate))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(passport.initialize())

// connect to the "/routes" directory
const routersPath = path.join(__dirname, "routes")

try {
// read all files in the "/routes" directory
    fs.readdirSync(routersPath).map(async (file) => {
        if (file.endsWith("js")) {
            // dynamically import the router module
            const routerModule = await import(path.join(routersPath, file))
            // note: using routerModule.default because that's where the default exported router is.
            // Or we can use routerModule.`export router name` if it's not a default export and a named export
            const router = routerModule.default

            // noinspection JSCheckFunctionSignatures
            app.use(path.join("/api/v1", file.split(".")[0]), router)
        }
    })
// check res.http file for all available routes
} catch (err) {
    console.error(err)
    logger(`${err.name}: ${err.message}`, ERROR_LOGS_FILE)
}

app.get("/", (req, res) => {
    return res.send('Expense Manager')
})

const port = process.env.PORT || 3002

app.listen(port, () => console.log(`App is listening on port: ${port}`))
