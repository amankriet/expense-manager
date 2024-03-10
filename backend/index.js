import express from "express";
import cors from "cors";
import { config } from "dotenv";
import authRoute from "./routes/auth.route.js";
import UserRoute from "./routes/user.route.js";
import ExpenseRoute from "./routes/expense.route.js";

config({
  path: "./.env",
});

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1", authRoute);
app.use("/api/v1/users", UserRoute);
app.use("/api/v1/expenses", ExpenseRoute);

const port = process.env.PORT || 3002;

app.listen(port, () => console.log(`App is listening on port: ${port}`));
