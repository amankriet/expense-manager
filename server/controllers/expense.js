import ExpenseModel from "../models/ExpenseModel.js"
import { PAGINATION, EXCLUDED_FIELDS } from "../utils/common.js"

const getAuthenticatedUserId = (req) => req.user?._id || req.user?.id

const allowedFields = [
    "title",
    "amount",
    "category",
    "date",
    "description",
    "type",
];

export const addExpense = async (req, res) => {
    const userId = getAuthenticatedUserId(req)

    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized! Please login again",
            error: "Missing authenticated user id"
        })
    }

    try {
        const updates = {}
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const expense = await ExpenseModel.create({
            userId,
            ...updates
        })

        if (expense) {
            const sanitizedExpense = expense.toObject()
            delete sanitizedExpense.userId
            delete sanitizedExpense.createdAt
            delete sanitizedExpense.updatedAt
            delete sanitizedExpense.__v

            return res.status(201).json({
                success: true,
                message: "User expense added successfully",
                expense: sanitizedExpense
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
    const userId = getAuthenticatedUserId(req)

    if (req.error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: req.error.toString()
        })
    }

    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized! Please login again",
            error: "Missing authenticated user id"
        })
    }

    const { limit = Number(PAGINATION.DEFAULT_LIMIT), page = Number(PAGINATION.DEFAULT_PAGE) } = req.query
    const skipData = limit * (page - 1)
    try {
        const expenses = await ExpenseModel
            .find({ userId })
            .skip(skipData)
            .limit(limit)
            .select(EXCLUDED_FIELDS)

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
    const userId = getAuthenticatedUserId(req)

    if (req.error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: req.error.toString()
        })
    }

    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized! Please login again",
            error: "Missing authenticated user id"
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
        const expense = await ExpenseModel.findOne({ _id: expenseid, userId })
            .select(EXCLUDED_FIELDS)

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
    const userId = getAuthenticatedUserId(req)

    if (req.error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: req.error.toString()
        })
    }

    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized! Please login again",
            error: "Missing authenticated user id"
        })
    }

    const expenseid = req.query.id
    const sanitizedExpenseId = new mongoose.Types.ObjectId(expenseid);

    if (!expenseid) {
        return res.status(400).json({
            success: false,
            message: "Invalid request. Please select an expense to update",
            error: "Invalid request. Missing expense id"
        })
    }

    try {
        const updates = {}
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const expense = await ExpenseModel.findOneAndUpdate(
            { _id: sanitizedExpenseId, userId },
            updates,
            { new: true, runValidators: true }
        ).select(EXCLUDED_FIELDS)

        if (expense) {
            return res.status(200).json({
                success: true,
                message: "Expense updated successfully",
                expense
            })
        }

        return res.status(404).json({
            success: false,
            message: "Expense not found. Please try again",
            error: "Expense not found. Invalid expense id"
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Failed to update user expense",
            error: error.toString()
        })
    }
}

export const deleteExpense = async (req, res) => {
    const userId = getAuthenticatedUserId(req)

    if (req.error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: req.error.toString()
        })
    }

    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized! Please login again",
            error: "Missing authenticated user id"
        })
    }

    const expenseid = req.query.id

    if (!expenseid) {
        return res.status(400).json({
            success: false,
            message: "Invalid request. Please select an expense to delete",
            error: "Invalid request. Missing expense id"
        })
    }

    try {
        const expense = await ExpenseModel.findOneAndDelete({
            _id: expenseid,
            userId
        }).select(EXCLUDED_FIELDS)

        if (expense) {
            return res.status(200).json({
                success: true,
                message: "Expense deleted successfully",
                expense
            })
        }

        return res.status(404).json({
            success: false,
            message: "Expense not found. Please try again",
            error: "Expense not found. Invalid expense id"
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Failed to delete user expense",
            error: error.toString()
        })
    }
}
