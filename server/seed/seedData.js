// Run with: npm run seed        (loads sample data)
//           npm run seed:destroy (wipes it)
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Expense from "../models/Expense.js";
import Income from "../models/Income.js";

dotenv.config();

const SAMPLE_EMAIL = "demo@example.com";
const SAMPLE_PASSWORD = "demo1234";

const expenseSamples = [
  { title: "Grocery shopping", amount: 62.5, category: "Food", paymentMethod: "Card", notes: "Weekly groceries" },
  { title: "Uber to airport", amount: 34.2, category: "Travel", paymentMethod: "UPI", notes: "" },
  { title: "Electricity bill", amount: 88.0, category: "Bills", paymentMethod: "Bank Transfer", notes: "March bill" },
  { title: "Gym membership", amount: 45.0, category: "Health", paymentMethod: "Card", notes: "Monthly" },
  { title: "Online course", amount: 120.0, category: "Education", paymentMethod: "Card", notes: "React course" },
  { title: "Movie night", amount: 28.0, category: "Entertainment", paymentMethod: "Cash", notes: "" },
  { title: "New headphones", amount: 75.99, category: "Shopping", paymentMethod: "Card", notes: "" },
  { title: "Mutual fund SIP", amount: 200.0, category: "Investment", paymentMethod: "Bank Transfer", notes: "" },
  { title: "Coffee with friends", amount: 14.5, category: "Food", paymentMethod: "Cash", notes: "" },
  { title: "Phone repair", amount: 55.0, category: "Other", paymentMethod: "Card", notes: "Screen replacement" },
];

const incomeSamples = [
  { source: "Monthly Salary", amount: 3200.0, notes: "March salary" },
  { source: "Freelance Project", amount: 450.0, notes: "Landing page build" },
  { source: "Dividend", amount: 60.0, notes: "" },
];

function randomDateWithinMonths(months) {
  const now = new Date();
  const past = new Date();
  past.setMonth(past.getMonth() - months);
  return new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()));
}

async function seed() {
  await connectDB();

  const destroy = process.argv.includes("--destroy");

  const existingUser = await User.findOne({ email: SAMPLE_EMAIL });

  if (destroy) {
    if (existingUser) {
      await Promise.all([
        Expense.deleteMany({ user: existingUser._id }),
        Income.deleteMany({ user: existingUser._id }),
        User.findByIdAndDelete(existingUser._id),
      ]);
      console.log("Sample data destroyed.");
    } else {
      console.log("No sample data found to destroy.");
    }
    return mongoose.connection.close();
  }

  if (existingUser) {
    console.log(`Sample user already exists (${SAMPLE_EMAIL}). Skipping.`);
    return mongoose.connection.close();
  }

  const user = await User.create({ name: "Demo User", email: SAMPLE_EMAIL, password: SAMPLE_PASSWORD });

  await Expense.insertMany(
    expenseSamples.map((e) => ({ ...e, user: user._id, date: randomDateWithinMonths(5) }))
  );

  await Income.insertMany(
    incomeSamples.map((i) => ({ ...i, user: user._id, date: randomDateWithinMonths(5) }))
  );

  console.log("Sample data created:");
  console.log(`  Email:    ${SAMPLE_EMAIL}`);
  console.log(`  Password: ${SAMPLE_PASSWORD}`);

  await mongoose.connection.close();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
