import mongoose from "mongoose";

export const EXPENSE_CATEGORIES = [
  "Food",
  "Shopping",
  "Travel",
  "Bills",
  "Health",
  "Education",
  "Entertainment",
  "Salary",
  "Investment",
  "Other",
];

export const PAYMENT_METHODS = ["Cash", "Card", "UPI", "Bank Transfer", "Other"];

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 100,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: EXPENSE_CATEGORIES,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      enum: PAYMENT_METHODS,
      default: "Cash",
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
  },
  { timestamps: true }
);

expenseSchema.index({ user: 1, date: -1 });

export default mongoose.model("Expense", expenseSchema);
