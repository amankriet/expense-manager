import UserModel from "../models/userModel.js";
import { hashSync } from "bcrypt";

const userId = null;

export const getLongUserId = () => {
  return userId;
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await UserModel.findOne({ email });

    if (!user || user.password != password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Set the userId variable
    userId = user._id.toString();
    console.debug("UserId:", userId);

    return res.json({ message: "Login successful", userId: user._id });
  } catch (error) {
    console.error(error.toString());
    return res.status(500).json({ error: "Server error" });
  }
};

export const signup = async (req, res) => {
  const { firstName, lastName, email, password, mobile, dob } = req.body;

  try {
    // check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(400).json("User already exists");
    } else {
      console.log(req.body);

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
      console.debug("user id after signup:", userId);

      res.send({
        success: true,
        message: "User created successfully",
        user: {
          id: newUser._id,
          name: `${newUser.firstName} ${newUser.lastName}`,
        },
      });
    }
  } catch (error) {
    res.send({
      success: false,
      message: "Something went wrong",
      error: error.toString(),
    });
  }
};
