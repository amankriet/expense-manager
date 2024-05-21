import UserModel from "../models/UserModel.js";
import dayjs from "dayjs";
import localizedFormat from 'dayjs/plugin/localizedFormat.js';
import {EXCLUDED_FIELDS, PAGINATION} from "../utils/common.js";

dayjs.extend(localizedFormat);

export const getAllUsers = async (req, res) => {
  if (req.error) {
    return res.status(401).json({
      success: false,
      message: `Unauthorized! Please check for valid credentials.`,
      error: req.error.toString()
    })
  }

  const { limit = PAGINATION.DEFAULT_LIMIT, page = PAGINATION.DEFAULT_PAGE } = req.query
  const skipData = (page - 1) * limit

  if (req.user.role == "admin") {
    const users = await UserModel.find().skip(skipData)
      .limit(limit)
      .select(EXCLUDED_FIELDS)

    if (!users) {
      return res.status(404).json({
        success: false,
        message: "No user found",
        error: "Not Found",
      });
    } else {
      return res.status(200).json({
        success: true,
        users
      });
    }
  } else {
    res.status(404).json({
      success: false,
      message: "Admin privileges required",
      error: "Forbidden!"
    })
  }
};

export const getUser = async (req, res) => {
  if (req.error) {
    return res.status(401).json({
      success: false,
      message: `Unauthorized! Please check for valid credentials.`,
      error: req.error.toString()
    })
  }

  const requestedId = req.query.id

  try {
    if (!requestedId || requestedId && requestedId === req.user.id) {
      if (req.user) {
        return res.status(200).json({
          success: true,
          message: "User Found",
          user: req.user
        })
      } else if (req.error) {
        return res.status(404).json({
          success: false,
          message: "User not found!",
          error: req.error
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Unable to retrieve user data. Please try again!",
          error: "Something went wrong!"
        });
      }
    }

    if (requestedId && req.user.role === "admin") {
      const user = await UserModel.findById(requestedId)
        .select(EXCLUDED_FIELDS)

      if (user) {
        return res.status(200).json({
          success: true,
          message: "User found",
          user
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Unable to retrieve user data. Please try again!",
          error: "Something went wrong"
        });
      }
    } else {
      return res.status(403).json({
        success: false,
        message: "Admin privileges required!",
        error: "Forbidden!"
      })
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: error.toString()
    })
  }
};

export const updateUser = async (req, res) => {
  if (req.error) {
    return res.status(401).json({
      success: false,
      message: `Unauthorized! Please check for valid credentials.`,
      error: req.error.toString()
    })
  }

  if (Object.keys(req.body).length === 0) {
    return res.status(404).json({
      success: false,
      message: "Empty or invalid request",
      error: "Request body not found"
    })
  }

  const requestedId = req.query.id

  try {
    if (requestedId && req.user.role === "admin") {
      const user = await updateUserByID(requestedId, req, true)

      if (req.error) {
        return res.status(403).json({
          success: false,
          message: "Forbidden! Admin privileges required",
          error: req.error
        })
      }

      if (user) {
        return res.status(200).json({
          success: true,
          message: "User data update successful",
          user
        })
      } else {
        return res.status(500).json({
          success: false,
          message: "User data update failed",
          error: "Something went wrong"
        })
      }
    } else if (requestedId && req.user.id == requestedId || !requestedId) {
      const user = await updateUserByID(req.user.id, req, false)

      if (req.error) {
        return res.status(403).json({
          success: false,
          message: "Forbidden! Admin privileges required",
          error: req.error
        })
      }

      if (user) {
        return res.status(200).json({
          success: true,
          message: "User data update successful",
          user
        })
      } else {
        return res.status(500).json({
          success: false,
          message: "User data update failed",
          error: "Something went wrong"
        })
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Something went wrong",
        error: "Please check your login or admin privileges"
      })
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: error.toString()
    })
  }
}

async function updateUserByID(id, req, admin) {
  const { role } = req.body;
  const userID = req.user.id

  if (!admin && role === "admin") {
    req.error = "User role cannot be modified by user itself. Please contact admin"
    return
  }

  try {
    return await UserModel.findByIdAndUpdate(id, {
      $set: {
        ...req.body, lastUpdatedBy: userID
      },
      $currentDate: { lastModified: true }
    }, {
      new: true
    }).select(EXCLUDED_FIELDS)
  } catch (error) {
    req.error = error
  }
}

export const deleteUser = async (req, res) => {
  if (req.error) {
    return res.status(401).json({
      success: false,
      message: `Unauthorized! Please check for valid credentials.`,
      error: req.error.toString()
    })
  }

  const requestedId = req.query.id

  if (requestedId && req.user.role === "user" && requestedId !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "Missing admin privileges",
      error: "Forbidden! Please login with admin account and request again"
    })
  }

  try {
    let user

    if (requestedId && req.user.role === "admin") {
      user = await deleteUserById(requestedId)
    } else {
      user = await deleteUserById(req.user.id)
    }

    if (user) {
      return res.status(200).json({
        success: true,
        message: "User data deleted successfully",
        user
      })
    } else {
      return res.status(404).json({
        success: false,
        message: "User data not found",
        error: "Not found! Please check the user id you wish to delete"
      })
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: error.toString()
    })
  }
}

async function deleteUserById(id) {
  return UserModel.findByIdAndDelete(id)
    .select(EXCLUDED_FIELDS)
}