import jwt from "jsonwebtoken";

/**
 * Signs a JWT for the given user id.
 * `rememberMe` extends the token lifetime for the "Remember Me" login option.
 */
export default function generateToken(userId, rememberMe = false) {
  const expiresIn = rememberMe ? "30d" : process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn });
}
