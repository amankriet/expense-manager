import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: Number,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    role: {
      type: String,
      required: false,
      maxLength: 30,
      default: "user"
    }
  },
  { timestamps: true }
);

const UserModel = model("UserModel", UserSchema);

export default UserModel;
