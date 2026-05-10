import User from "../models/User.js";
import { verifyJwt } from "../utils/jwt.js";

// Middleware to check if user is authenticated (manual JWT auth)
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length)
      : null;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "not authenticated" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res
        .status(500)
        .json({ success: false, message: "JWT_SECRET not configured" });
    }

    const payload = verifyJwt(token, secret);
    const userId = payload?.sub;

    if (!userId) {
      return res.status(401).json({ success: false, message: "invalid token" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ success: false, message: "user not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "invalid token" });
  }
};
