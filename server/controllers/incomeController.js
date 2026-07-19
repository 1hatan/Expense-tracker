import Income from "../models/Income.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * @route   GET /api/income
 * @access  Private
 * Query params: search, startDate, endDate, sortBy, order, page, limit
 */
export const getIncomes = asyncHandler(async (req, res) => {
  const { search, startDate, endDate, sortBy = "date", order = "desc", page = 1, limit = 10 } = req.query;

  const query = { user: req.user._id };

  if (search) {
    query.$or = [{ source: { $regex: search, $options: "i" } }, { notes: { $regex: search, $options: "i" } }];
  }

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  const sortField = ["amount", "date", "source"].includes(sortBy) ? sortBy : "date";
  const sortOrder = order === "asc" ? 1 : -1;

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
  const skip = (pageNum - 1) * limitNum;

  const [incomes, total] = await Promise.all([
    Income.find(query).sort({ [sortField]: sortOrder }).skip(skip).limit(limitNum),
    Income.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: incomes.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    data: incomes,
  });
});

/**
 * @route   GET /api/income/:id
 * @access  Private
 */
export const getIncomeById = asyncHandler(async (req, res) => {
  const income = await Income.findOne({ _id: req.params.id, user: req.user._id });

  if (!income) {
    res.status(404);
    throw new Error("Income not found");
  }

  res.status(200).json({ success: true, data: income });
});

/**
 * @route   POST /api/income
 * @access  Private
 */
export const createIncome = asyncHandler(async (req, res) => {
  const { source, amount, date, notes } = req.body;

  if (!source || !amount) {
    res.status(400);
    throw new Error("Source and amount are required");
  }

  const income = await Income.create({
    user: req.user._id,
    source,
    amount,
    date: date || Date.now(),
    notes,
  });

  res.status(201).json({ success: true, data: income });
});

/**
 * @route   PUT /api/income/:id
 * @access  Private
 */
export const updateIncome = asyncHandler(async (req, res) => {
  const income = await Income.findOne({ _id: req.params.id, user: req.user._id });

  if (!income) {
    res.status(404);
    throw new Error("Income not found");
  }

  const { source, amount, date, notes } = req.body;

  income.source = source ?? income.source;
  income.amount = amount ?? income.amount;
  income.date = date ?? income.date;
  income.notes = notes ?? income.notes;

  await income.save();

  res.status(200).json({ success: true, data: income });
});

/**
 * @route   DELETE /api/income/:id
 * @access  Private
 */
export const deleteIncome = asyncHandler(async (req, res) => {
  const income = await Income.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!income) {
    res.status(404);
    throw new Error("Income not found");
  }

  res.status(200).json({ success: true, message: "Income deleted", data: { id: req.params.id } });
});
