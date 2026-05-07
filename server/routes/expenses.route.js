/**
 * CRUD
 * Monthly Expenses
 * Weekly Expenses
 * Date Filter (Start and End Date)
 * Categories based
 */

import { Router } from "express";
import passport from "passport";
import { addExpense, deleteExpense, getAllExpenses, getExpense, updateExpense } from "../controllers/expense.js";
import { apiLimiter } from "../middlewares/rateLimit.js";

const expenseRouter = Router()

expenseRouter.use(passport.authenticate("jwt", { session: false }))
expenseRouter.use(apiLimiter)

expenseRouter
  .get("/", getExpense)
  .post("/", addExpense)
  .patch("/", updateExpense)
  .delete("/", deleteExpense)
  .get("/all", getAllExpenses)

export default expenseRouter