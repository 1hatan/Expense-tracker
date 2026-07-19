import express from "express";
import {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseOptions,
} from "../controllers/expenseController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/meta/options", getExpenseOptions);
router.route("/").get(getExpenses).post(createExpense);
router.route("/:id").get(getExpenseById).put(updateExpense).delete(deleteExpense);

export default router;
