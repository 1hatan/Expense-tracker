import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";

let cachedPublicUserPromise = null;

async function getOrCreatePublicUser() {
  if (cachedPublicUserPromise) {
    try {
      const u = await cachedPublicUserPromise;
      if (u && u._id) return u;
    } catch {
      cachedPublicUserPromise = null;
    }
  }

  cachedPublicUserPromise = (async () => {
    try {
      let publicUser = await User.findOne({ email: "public@expensetracker.local" });
      if (!publicUser) {
        publicUser = await User.create({
          name: "Expense Tracker User",
          email: "public@expensetracker.local",
          password: "openaccesspassword123",
          currency: "INR",
        });
      }
      return publicUser;
    } catch (err) {
      let publicUser = await User.findOne({ email: "public@expensetracker.local" });
      if (publicUser) return publicUser;
      let anyUser = await User.findOne();
      if (anyUser) return anyUser;
      cachedPublicUserPromise = null;
      throw err;
    }
  })();

  return cachedPublicUserPromise;
}

/**
 * Open-access middleware: automatically attaches default public user so income/expenses are saved in MongoDB.
 */
export const protect = asyncHandler(async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const secret = process.env.JWT_SECRET || "expense_tracker_secret_key_123";
        const decoded = jwt.verify(token, secret);
        const user = await User.findById(decoded.id);
        if (user) {
          req.user = user;
          return next();
        }
      } catch {
        // Fall through to public user if token is invalid or missing
      }
    }

    req.user = await getOrCreatePublicUser();
    if (!req.user) {
      req.user = await User.findOne();
    }
    next();
  } catch (error) {
    console.error("Auth middleware error fallback:", error);
    req.user = await User.findOne();
    next();
  }
});
