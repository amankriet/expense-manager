import express from "express";
import cors from "cors";
import "./config/database.js";
import passport from "passport";
import "./config/passport.js";
import path from "path";
import fs from "fs";

const __dirname = path.resolve();

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// connect to the "/routes" directory
const routersPath = path.join(__dirname, "routes");

// read all files in the "/routes" directory
fs.readdirSync(routersPath).map(async (file) => {
  if (file.endsWith("js")) {
    // dynamically import the router module
    const routerModule = await import(path.join(routersPath, file));
    // note: using routerModule.default because that's where the default exported router is. 
    // Or we can use routerModule.`export router name` if it's not a default export and a named export
    const router = routerModule.default;

    app.use(path.join("/api/v1", file.split(".")[0]), router);
  }
})
// check res.http file for all available routes

const port = process.env.PORT || 3002;

app.listen(port, () => console.log(`App is listening on port: ${port}`));
