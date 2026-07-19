import express from "express";
import { getDashboardSummary, getReport } from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/dashboard", getDashboardSummary);
router.get("/", getReport);

export default router;
