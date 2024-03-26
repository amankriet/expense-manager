import UserModel from "../models/userModel.js";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat.js";

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
    res.status(401).json({
      success: false,
      message: "Admin privileges missing",
      error: "Unauthorized!"
    })
  }
};

export const getUser = async (req, res) => {

  console.log("req:", req);

  if (req.error) {
    return res.status(403).json({
      success: false,
      message: "Unable to find the user",
      error: req.error
    });
  }

  return res.status(200).json({
    success: true,
    message: "User Found",
    user: userObj(req.user)
  });
};

export const getIdUser = async (req, res) => {
  if (req.error) {
    res.send({
      success: false,
      message: `Unable to find user with id: ${req.params.id}`,
      error: req.error.toString()
    });
  }

  if (req.user.role == "admin") {
    const user = await UserModel.findById(req.params.id);
    if (user) {
      res.send({
        success: true,
        message: "User found",
        user: userObj(user)
      });
    } else {
      res.send({
        success: false,
        message: "Profile not found",
        error: "Something went wrong"
      });
    }
  } else {
    res.status(401).json({
      success: false,
      message: "Admin privileges missing",
      error: "Unauthorized!"
    })
  }
};

export const updateUser = async (req, res) => {
  if (req.error) {
    return res.status(403).json({
      success: false,
      message: "Forbidden or User not found",
      error: req.error
    });
  }

  const { _id, firstName, lastName, email, mobileNumber, dob } = req.user;

}
