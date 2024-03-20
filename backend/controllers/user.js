import userModel from "../models/userModel.js";

export const getAllUsers = async (req, res) => {
  const users = await userModel.find();

  if (!users) {
    return res.status(404).send({
      success: false,
      message: "No user found",
      error: "Not Found",
    });
  } else {
    return res.status(200).send({
      success: true,
      message: "Users Found",
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
  const { _id, firstName, lastName, email, mobileNumber, dob } = req.user;

  return res.status(200).send({
    success: true,
    user: {
      id: _id,
      firstName: firstName,
      lastName: lastName,
      email: email,
      mobile: mobileNumber,
      dob: dob,
    },
  });
};
