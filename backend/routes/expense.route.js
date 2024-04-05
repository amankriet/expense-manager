/**
 * CRUD
 * Monthly Expenses
 * Weekly Expenses
 * Date Filter (Start and End Date)
 * Categories based
 */

import { Router } from "express";
import passport from "passport";
import { addExpense, getAllExpenses } from "../controllers/expense.js";
import ExpenseModel from "../models/ExpenseModel.js";

const expenseRouter = Router()

expenseRouter.use(passport.authenticate("jwt", { session: false }))

expenseRouter
  .get("/:id", (req, res) => {
    res.status(200).json({
      success: true,
      message: `Get expense ${req.params.id} data`
    })
  })
  .post("/", addExpense)
  .patch("/:id", (req, res) => {
    res.status(200).json({
      success: true,
      message: `Update expense ${req.params.id} data`
    })
  })
  .delete("/:id", (req, res) => {
    res.status(200).json({
      success: true,
      message: `Delete expense ${req.params.id} data`
    })
  })
  .get("/", getAllExpenses)

expenseRouter.param("id", (req, res) => {
  console.log(`${req.params.id}`)

  if (!ExpenseModel.findById(req.params.id)) {
    res.status(404).json({
      success: false,
      message: "No matching expense found",
      error: "Not Found"
    })
  }
})

export default expenseRouter