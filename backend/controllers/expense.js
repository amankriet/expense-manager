import ExpenseModel from "../models/ExpenseModel.js"
import { PAGINATION, excludedFields } from "../utils/common.js"

export const addExpense = async (req, res) => {
    try {
        const expense = await ExpenseModel.create({
            userId: req.user.id,
            ...req.body
        }).select(excludedFields)

        if (expense) {
            return res.status(201).json({
                success: true,
                message: "User expense added successfully",
                expense
            })
        } else {
            return res.status(500).json({
                success: false,
                message: "Failed to add user expense",
                error: "Something went wrong"
            })
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Failed to add user expense",
            error: error.toString()
        })
    }
}

export const getAllExpenses = async (req, res) => {
    if (req.error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: req.error.toString()
        })
    }

    const { limit = PAGINATION.DEFAULT_LIMIT, page = PAGINATION.DEFAULT_PAGE } = req.query
    const skipData = limit * (page - 1)
    try {
        const expenses = await ExpenseModel
            .find({ userId: req.user.id })
            .skip(skipData)
            .limit(limit)
            .select(excludedFields)

        if (expenses.length > 0) {
            // send out filtered data after removing unnecesary data
            return res.status(200).json({
                success: true,
                message: "User expenses found",
                expenses: expenses
            })
        } else {
            // send out filtered data after removing unnecesary data
            return res.status(200).json({
                success: false,
                message: "Please start by adding some expenses",
                error: "No expenses found"
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.toString()
        })
    }
}

export const getExpense = async (req, res) => {
    if (req.error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: req.error.toString()
        })
    }

    const expenseid = req.query.id

    if (!expenseid) {
        return res.status(400).json({
            success: false,
            message: "Invalid request. Please select an expense to fetch",
            error: "Invalid request. Missing expense id"
        })
    }

    try {
        const expense = await ExpenseModel.findById(expenseid)
            .select(excludedFields)

        if (expense) {
            return res.status(200).json({
                success: true,
                message: "Expense details found",
                expense
            })
        } else {
            return res.status(404).json({
                success: false,
                message: "Expense not found. Please try again",
                error: "Expense not found. Invalid expense id"
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.toString()
        })
    }
}

export const updateExpense = async (req, res) => {
    if (req.error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: req.error.toString()
        })
    }

    const expenseid = req.query.id

    console.log(expenseid)

    return res.status(200).json({
        success: true,
        message: `Update expense ${req.params.id} data`
    })
}

export const deleteExpense = async (req, res) => {
    if (req.error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: req.error.toString()
        })
    }

    const expenseid = req.query.id

    console.log(expenseid)

    res.status(200).json({
        success: true,
        message: `Delete expense ${req.params.id} data`
    })
}