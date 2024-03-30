import { Schema, model, ObjectId } from "mongoose";

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    mobileNumber: {
      type: Number,
      required: true,
      unique: true
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
    },
    lastUpdatedBy: {
      type: ObjectId,
      default: null
    }
  },
  { timestamps: true }
);

const UserModel = model("UserModel", UserSchema);

export default UserModel;
