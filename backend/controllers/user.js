import userModel from "../models/userModel.js";

export const getAllUsers = async (req, res) => {
  const users = await userModel.find();

  if (!users) {
    return res.status(404).json({
      success: false,
      message: "No user found",
      error: "Not Found",
    });
  } else {
    return res.status(200).json({
      success: true,
      users: users.map(({ _id, firstName, lastName, email, mobileNumber }) => {
        return {
          id: _id,
          name: `${firstName} ${lastName}`,
          email: email,
          mobile: mobileNumber,
        };
      }),
    });
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

  const { _id, firstName, lastName, email, mobileNumber, dob, admin } = req.user;

  return res.status(200).json({
    success: true,
    user: {
      id: _id,
      firstName: firstName,
      lastName: lastName,
      email: email,
      mobile: mobileNumber,
      dob: dob,
      admin: admin
    },
  });
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
