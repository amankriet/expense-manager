import { Schema, model } from "mongoose";
import user from "./userModel";

const ExpenseSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: user,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 20,
    },
    amount: {
      type: Number,
      required: true,
      maxLength: 15,
      trim: true,
    },
    type: {
      type: String,
      default: "Expense",
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxLength: 20,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
      default: "",
    },
  },
  { timestamps: true }
);

export default model("ExpenseModel", ExpenseSchema);
