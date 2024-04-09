import { hashSync } from "bcrypt";
import { Schema, model, Types } from "mongoose";

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
    mobile: {
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
      default: "asas"
    },
    lastUpdatedBy: {
      type: Types.ObjectId,
      default: null
    }
  },
  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  this.password = hashSync(this.password, 10)
  next()
})

const UserModel = model("UserModel", UserSchema);

export default UserModel;
