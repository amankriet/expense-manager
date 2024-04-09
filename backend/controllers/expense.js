import ExpenseModel from "../models/ExpenseModel.js"
import { PAGINATION } from "../utils/common.js"

const getExpenseObj = (expense) => {
    // remove some default and other extra data from the response
    return {
        "id": expense._id,
        "title": expense.title,
        "amount": expense.amount,
        "type": expense.type,
        "date": expense.date,
        "category": expense.category,
        "description": expense.description
    }
}

export const addExpense = async (req, res) => {
    try {
        const expense = await ExpenseModel.create({
            userId: req.user.id,
            ...req.body
        })

        if (expense) {
            res.status(201).json({
                success: true,
                message: "User expense added successfully",
                expense: getExpenseObj(expense)
            })
        } else {
            res.status(500).json({
                success: false,
                message: "Failed to add user expense",
                error: "Something went wrong"
            })
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to add user expense",
            error: error.toString()
        })
    }
}

export const getAllExpenses = async (req, res) => {
    if (req.error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: req.error.toString()
        })
    }

    const { perPage = PAGINATION.DEFAULT_PER_PAGE, curPage = PAGINATION.DEFAULT_PAGE } = req.query
    const skipData = perPage * (curPage - 1)
    try {
        const expenses = await ExpenseModel.find({ userId: req.user.id }).skip(skipData).limit(perPage)

        if (expenses.length > 0) {
            // send out filtered data after removing unnecesary data
            res.status(200).json({
                success: true,
                message: "User expenses found",
                expenses: expenses.map(expense => getExpenseObj(expense))
            })
        } else {
            // send out filtered data after removing unnecesary data
            res.status(200).json({
                success: false,
                message: "Please start by adding some expenses",
                error: "No expenses found"
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.toString()
        })
    }
}

export const getExpense = async (req, res) => {
    if (req.error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: req.error.toString()
        })
    }

    const expenseid = req.query.id

    if (!expenseid) {
        res.status(400).json({
            success: false,
            message: "Invalid request. Please select an expense to fetch",
            error: "Invalid request. Missing expense id"
        })
    }

    try {
        const expense = await ExpenseModel.findById(expenseid)

        if (expense) {
            res.status(200).json({
                success: true,
                message: "Expense details found",
                expense: getExpenseObj(expense)
            })
        } else {
            res.status(404).json({
                success: false,
                message: "Expense not found. Please try again",
                error: "Expense not found. Invalid expense id"
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error
        })
    }
}