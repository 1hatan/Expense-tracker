import Expense, { EXPENSE_CATEGORIES, PAYMENT_METHODS } from "../models/Expense.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * @route   GET /api/expenses
 * @access  Private
 * Supports: search (title/notes), category filter, date range filter,
 * sort by amount/date, and pagination.
 * Query params: search, category, startDate, endDate, sortBy, order, page, limit
 */
export const getExpenses = asyncHandler(async (req, res) => {
  const { search, category, startDate, endDate, sortBy = "date", order = "desc", page = 1, limit = 10 } = req.query;

  const query = { user: req.user._id };

  if (search) {
    query.$or = [{ title: { $regex: search, $options: "i" } }, { notes: { $regex: search, $options: "i" } }];
  }

  if (category && category !== "All") {
    query.category = category;
  }

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  const sortField = ["amount", "date", "title"].includes(sortBy) ? sortBy : "date";
  const sortOrder = order === "asc" ? 1 : -1;

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
  const skip = (pageNum - 1) * limitNum;

  const [expenses, total] = await Promise.all([
    Expense.find(query).sort({ [sortField]: sortOrder }).skip(skip).limit(limitNum),
    Expense.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: expenses.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    data: expenses,
  });
});

/**
 * @route   GET /api/expenses/:id
 * @access  Private
 */
export const getExpenseById = asyncHandler(async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });

  if (!expense) {
    res.status(404);
    throw new Error("Expense not found");
  }

  res.status(200).json({ success: true, data: expense });
});

/**
 * @route   POST /api/expenses
 * @access  Private
 */
export const createExpense = asyncHandler(async (req, res) => {
  const { title, amount, category, date, paymentMethod, notes } = req.body;

  if (!title || !amount || !category) {
    res.status(400);
    throw new Error("Title, amount, and category are required");
  }

  const expense = await Expense.create({
    user: req.user._id,
    title,
    amount,
    category,
    date: date || Date.now(),
    paymentMethod,
    notes,
  });

  res.status(201).json({ success: true, data: expense });
});

/**
 * @route   PUT /api/expenses/:id
 * @access  Private
 */
export const updateExpense = asyncHandler(async (req, res) => {
  let expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });

  if (!expense) {
    res.status(404);
    throw new Error("Expense not found");
  }

  const { title, amount, category, date, paymentMethod, notes } = req.body;

  expense.title = title ?? expense.title;
  expense.amount = amount ?? expense.amount;
  expense.category = category ?? expense.category;
  expense.date = date ?? expense.date;
  expense.paymentMethod = paymentMethod ?? expense.paymentMethod;
  expense.notes = notes ?? expense.notes;

  await expense.save();

  res.status(200).json({ success: true, data: expense });
});

/**
 * @route   DELETE /api/expenses/:id
 * @access  Private
 */
export const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!expense) {
    res.status(404);
    throw new Error("Expense not found");
  }

  res.status(200).json({ success: true, message: "Expense deleted", data: { id: req.params.id } });
});

/**
 * @route   GET /api/expenses/meta/options
 * @access  Private
 * Returns the fixed category / payment method lists so the frontend
 * doesn't have to hardcode them separately from the schema.
 */
export const getExpenseOptions = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, categories: EXPENSE_CATEGORIES, paymentMethods: PAYMENT_METHODS });
});
