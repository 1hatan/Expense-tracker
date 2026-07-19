import express from "express";
import { updateProfile, updateAvatar, changePassword, deleteAccount } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.put("/profile", updateProfile);
router.put("/avatar", updateAvatar);
router.put("/password", changePassword);
router.delete("/account", deleteAccount);

export default router;
