/**
 * CRUD
 * Monthly Expenses
 * Weekly Expenses
 * Date Filter (Start and End Date)
 * Categories based
 */

import { Router } from "express";
import passport from "passport";
import { addExpense, getAllExpenses, getExpense } from "../controllers/expense.js";
import ExpenseModel from "../models/ExpenseModel.js";

const expenseRouter = Router()

expenseRouter.use(passport.authenticate("jwt", { session: false }))

expenseRouter
  .get("/", getExpense)
  .post("/", addExpense)
  .patch("/", (req, res) => {
    res.status(200).json({
      success: true,
      message: `Update expense ${req.params.id} data`
    })
  })
  .delete("/", (req, res) => {
    res.status(200).json({
      success: true,
      message: `Delete expense ${req.params.id} data`
    })
  })
  .get("/all", getAllExpenses)

export default expenseRouter