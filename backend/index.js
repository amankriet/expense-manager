import express from "express";
import cors from "cors";
import UserRoute from "./routes/user.route.js";
import UserExpense from "./routes/expense.route.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/users", UserRoute);
app.use("/api/v1/expenses", UserExpense);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
