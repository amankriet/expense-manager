import { hashSync } from "@node-rs/bcrypt";
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
      default: "user"
    },
    lastUpdatedBy: {
      type: Types.ObjectId,
      default: null
    }
  },
  { id: false },
  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  this.password = hashSync(this.password, 10)
  next()
})

UserSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`
})

UserSchema.set('toObject', {
  virtuals: true
})

UserSchema.set('toJSON', {
  virtuals: true
})

const UserModel = model("UserModel", UserSchema);

export default UserModel;
