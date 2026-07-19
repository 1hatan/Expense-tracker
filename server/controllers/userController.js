import User from "../models/User.js";
import Expense from "../models/Expense.js";
import Income from "../models/Income.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * @route   PUT /api/users/profile
 * @access  Private
 * Updates name / email / currency.
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { name, email, currency } = req.body;

  if (email && email !== user.email) {
    const emailTaken = await User.findOne({ email });
    if (emailTaken) {
      res.status(400);
      throw new Error("Email already in use");
    }
  }

  user.name = name ?? user.name;
  user.email = email ?? user.email;
  user.currency = currency ?? user.currency;

  await user.save();

  res.status(200).json({
    success: true,
    user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, currency: user.currency },
  });
});

/**
 * @route   PUT /api/users/avatar
 * @access  Private
 * Body: { image: "data:image/png;base64,...." }
 * Stored directly as a data URL — swap for cloud storage (S3/Cloudinary)
 * in a real production deployment to avoid bloating the database.
 */
export const updateAvatar = asyncHandler(async (req, res) => {
  const { image } = req.body;

  if (!image) {
    res.status(400);
    throw new Error("No image provided");
  }

  const user = await User.findById(req.user._id);
  user.avatar = image;
  await user.save();

  res.status(200).json({ success: true, avatar: user.avatar });
});

/**
 * @route   PUT /api/users/password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error("Current and new password are required");
  }

  if (newPassword.length < 6) {
    res.status(400);
    throw new Error("New password must be at least 6 characters");
  }

  const user = await User.findById(req.user._id).select("+password");

  if (!(await user.matchPassword(currentPassword))) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({ success: true, message: "Password updated successfully" });
});

/**
 * @route   DELETE /api/users/account
 * @access  Private
 * Deletes the user and cascades to their expenses/income records.
 */
export const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  await Promise.all([
    Expense.deleteMany({ user: userId }),
    Income.deleteMany({ user: userId }),
    User.findByIdAndDelete(userId),
  ]);

  res.status(200).json({ success: true, message: "Account and all associated data deleted" });
});
