import "./config/env.js";
import app from "./index.js";
import { connectDB } from "./config/database.js";

const port = process.env.PORT || 3001;

await connectDB();

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});