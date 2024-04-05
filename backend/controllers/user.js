import UserModel from "../models/UserModel.js";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat.js";
import { getLongUserId } from "./auth.js";

dayjs.extend(localizedFormat);

function userObj(user) {
  const { _id, firstName, lastName, email, mobileNumber, dob, role } = user;

  const userData = {
    id: _id,
    name: `${firstName} ${lastName}`,
    email: email,
    mobile: mobileNumber,
    dob: dayjs(dob).format("LL"),
    role: role ? role : "user"
  };

  return userData;
}

export const getAllUsers = async (req, res) => {
  if (req.error) {
    return res.status(401).json({
      success: false,
      message: `Unauthorized! Please check for valid credentials.`,
      error: req.error.toString()
    })
  }

  if (req.user.role == "admin") {
    const users = await UserModel.find();

    if (!users) {
      return res.status(404).json({
        success: false,
        message: "No user found",
        error: "Not Found",
      });
    } else {
      return res.status(200).json({
        success: true,
        users: users.map((user) => {
          return userObj(user);
        }),
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

  try {
    if (req.params.id == getLongUserId()) {
      if (req.user) {
        return res.status(200).json({
          success: true,
          message: "User Found",
          user: userObj(req.user)
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

    if (req.user.role == "admin") {
      const user = await UserModel.findById(req.params.id);
      if (user) {
        return res.status(200).json({
          success: true,
          message: "User found",
          user: userObj(user)
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

  const userID = req.params.id

  try {
    if (req.user.role == "admin") {
      const user = await updateUserByID(req.body.id, req, true)

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
          user: user
        })
      } else {
        return res.status(500).json({
          success: false,
          message: "User data update failed",
          error: "Something went wrong"
        })
      }
    } else if (userID && req.body.id == userID) {
      const user = await updateUserByID(userID, req, false)

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
          user: user
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
  const { firstName, lastName, email, mobileNumber, dob, role } = req.body;
  const userID = req.params.id

  if (!admin && role == "admin") {
    req.error = "User role cannot be modified by user itself. Please contact admin"
    return
  }

  try {
    const result = await UserModel.findByIdAndUpdate(id, {
      $set: {
        firstName: firstName,
        lastName: lastName, email: email, mobileNumber: mobileNumber, dob: dob, role: role, lastUpdatedBy: userID
      }
    })

    return userObj(result)
  } catch (error) {
    req.error = error
    return
  }
}

export const deleteUserByID = async (req, res) => {
  if (req.error) {
    return res.status(401).json({
      success: false,
      message: `Unauthorized! Please check for valid credentials.`,
      error: req.error.toString()
    })
  }

  try {
    if (req.params.id && req.user.role == "admin") {
      const result = await UserModel.findByIdAndDelete(req.params.id)

      if (result) {
        return res.status(200).json({
          success: true,
          message: "User data deleted successfully",
          user: userObj(result)
        })
      } else {
        return res.status(404).json({
          success: false,
          message: "User data not found",
          error: "Not found! Please check the user id you wish to delete"
        })
      }
    } else if (!req.params.id) {
      return res.status(400).json({
        success: false,
        message: "Bad request!",
        error: "Missing user id in params"
      })
    } else if (req.user.role == "user") {
      return res.status(403).json({
        success: false,
        message: "Missing admin priviliges",
        error: "Forbidden! Please login with admin account and request again"
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