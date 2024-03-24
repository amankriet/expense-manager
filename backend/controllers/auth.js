import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";
import { compareSync, hashSync } from "bcrypt";
import "dotenv/config";

let userId = null;

export const getLongUserId = () => {
  return userId;
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await UserModel.findOne({ email });

    if (!user || !compareSync(password, user.password)) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
        error: "Invalid credentials",
      });
    }

    // Set the userId variable
    userId = user._id.toString();

    const payload = {
      email: email,
      id: user._id,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        userId: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: email,
        mobile: user.mobileNumber,
        dob: user.dob,
        token: `Bearer ${accessToken}`
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.toString(),
    });
  }
};

export const signup = async (req, res) => {
  const { firstName, lastName, email, password, mobile, dob } = req.body;

  try {
    // check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "Email already exists",
        error: "User already exists",
      });
    } else {
      // Create new user
      const newUser = await UserModel.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashSync(password, 10),
        mobileNumber: mobile,
        dob: dob,
      });

      // Set the userId
      userId = newUser._id.toString();

      const payload = {
        email: email,
        id: newUser._id,
      };

      const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
      });

      res.status(200).json({
        success: true,
        message: "User created successfully",
        user: {
          id: newUser._id,
          name: `${newUser.firstName} ${newUser.lastName}`,
          email: email,
          mobile: mobile,
          dob: dob,
          token: `Bearer ${accessToken}`
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.toString(),
    });
  }
};

export const logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out"
  });
};
