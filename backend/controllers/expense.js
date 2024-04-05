import ExpenseModel from "../models/ExpenseModel.js"
import { PAGINATION } from "../utils/common.js"

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
                expense: expense
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

    let { perPage = PAGINATION.DEFAULT_PER_PAGE, curPage = PAGINATION.DEFAULT_PAGE } = req.query
    const skipData = perPage * (curPage - 1)
    try {
        const expenses = await ExpenseModel.find({ userId: req.user.id }).skip(skipData).limit(perPage)

        res.status(200).json({
            success: true,
            message: "User expenses found",
            expenses
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.toString()
        })
    }
}