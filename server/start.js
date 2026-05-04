import "./config/env.js";
import app from "./index.js";
import { connectDB } from "./config/database.js";

const port = process.env.PORT || 3001;
const host = "0.0.0.0";

await connectDB();

app.listen(port, host, () => {
    console.log(`Server running on ${host}:${port}`);
});
