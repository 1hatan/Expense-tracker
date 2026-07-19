import mongoose from "mongoose";
import Expense from "../models/Expense.js";
import Income from "../models/Income.js";
import asyncHandler from "../utils/asyncHandler.js";

const toObjectId = (id) => new mongoose.Types.ObjectId(id);

/**
 * @route   GET /api/reports/dashboard
 * @access  Private
 * Returns everything the dashboard page needs in one call: totals,
 * monthly savings, recent transactions, category breakdown, and a
 * 6-month income-vs-expense series for the chart.
 */
export const getDashboardSummary = asyncHandler(async (req, res) => {
  const userId = toObjectId(req.user._id);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [incomeTotalAgg, expenseTotalAgg, monthlyIncomeAgg, monthlyExpenseAgg, categoryAgg, recentExpenses, recentIncome, monthlySeries] =
    await Promise.all([
      Income.aggregate([{ $match: { user: userId } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
      Expense.aggregate([{ $match: { user: userId } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
      Income.aggregate([
        { $match: { user: userId, date: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Expense.aggregate([
        { $match: { user: userId, date: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Expense.aggregate([
        { $match: { user: userId } },
        { $group: { _id: "$category", total: { $sum: "$amount" } } },
        { $sort: { total: -1 } },
      ]),
      Expense.find({ user: req.user._id }).sort({ date: -1 }).limit(5),
      Income.find({ user: req.user._id }).sort({ date: -1 }).limit(5),
      buildMonthlySeries(userId, sixMonthsAgo),
    ]);

  const totalIncome = incomeTotalAgg[0]?.total || 0;
  const totalExpense = expenseTotalAgg[0]?.total || 0;
  const monthlyIncome = monthlyIncomeAgg[0]?.total || 0;
  const monthlyExpense = monthlyExpenseAgg[0]?.total || 0;

  const recentTransactions = [
    ...recentExpenses.map((e) => ({ ...e.toObject(), type: "expense", label: e.title })),
    ...recentIncome.map((i) => ({ ...i.toObject(), type: "income", label: i.source })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);

  res.status(200).json({
    success: true,
    data: {
      totalBalance: totalIncome - totalExpense,
      totalIncome,
      totalExpense,
      monthlySavings: monthlyIncome - monthlyExpense,
      recentTransactions,
      categoryBreakdown: categoryAgg.map((c) => ({ category: c._id, total: c.total })),
      monthlySeries,
    },
  });
});

/**
 * Builds a month-by-month income vs expense series for chart rendering.
 */
async function buildMonthlySeries(userId, since) {
  const [incomeByMonth, expenseByMonth] = await Promise.all([
    Income.aggregate([
      { $match: { user: userId, date: { $gte: since } } },
      { $group: { _id: { y: { $year: "$date" }, m: { $month: "$date" } }, total: { $sum: "$amount" } } },
    ]),
    Expense.aggregate([
      { $match: { user: userId, date: { $gte: since } } },
      { $group: { _id: { y: { $year: "$date" }, m: { $month: "$date" } }, total: { $sum: "$amount" } } },
    ]),
  ]);

  const months = [];
  const cursor = new Date(since);
  const now = new Date();
  while (cursor <= now) {
    months.push({ y: cursor.getFullYear(), m: cursor.getMonth() + 1 });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  const find = (arr, y, m) => arr.find((x) => x._id.y === y && x._id.m === m)?.total || 0;
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return months.map(({ y, m }) => ({
    label: `${monthNames[m - 1]} ${y}`,
    income: find(incomeByMonth, y, m),
    expense: find(expenseByMonth, y, m),
  }));
}

/**
 * @route   GET /api/reports?period=daily|weekly|monthly|yearly&date=YYYY-MM-DD
 * @access  Private
 * Returns income/expense totals grouped for the requested period, plus
 * a category breakdown for pie-chart rendering.
 */
export const getReport = asyncHandler(async (req, res) => {
  const userId = toObjectId(req.user._id);
  const { period = "monthly", date } = req.query;
  const refDate = date ? new Date(date) : new Date();

  const { start, end } = getPeriodRange(period, refDate);

  const [incomeTotalAgg, expenseTotalAgg, categoryAgg, expenses, incomes] = await Promise.all([
    Income.aggregate([
      { $match: { user: userId, date: { $gte: start, $lte: end } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Expense.aggregate([
      { $match: { user: userId, date: { $gte: start, $lte: end } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Expense.aggregate([
      { $match: { user: userId, date: { $gte: start, $lte: end } } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } },
    ]),
    Expense.find({ user: req.user._id, date: { $gte: start, $lte: end } }).sort({ date: 1 }),
    Income.find({ user: req.user._id, date: { $gte: start, $lte: end } }).sort({ date: 1 }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      period,
      range: { start, end },
      totalIncome: incomeTotalAgg[0]?.total || 0,
      totalExpense: expenseTotalAgg[0]?.total || 0,
      categoryBreakdown: categoryAgg.map((c) => ({ category: c._id, total: c.total })),
      expenses,
      incomes,
    },
  });
});

function getPeriodRange(period, refDate) {
  const start = new Date(refDate);
  const end = new Date(refDate);

  switch (period) {
    case "daily":
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case "weekly": {
      const day = start.getDay();
      start.setDate(start.getDate() - day);
      start.setHours(0, 0, 0, 0);
      end.setTime(start.getTime());
      end.setDate(end.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;
    }
    case "yearly":
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(11, 31);
      end.setHours(23, 59, 59, 999);
      break;
    case "monthly":
    default:
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(end.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      break;
  }

  return { start, end };
}
