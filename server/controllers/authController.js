import User from "../models/User.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { signJwt } from "../utils/jwt.js";

const normalizeEmail = (email) => (email || "").trim().toLowerCase();

export const register = async (req, res) => {
  try {
    const { username, email, password, image } = req.body || {};

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "username, email and password required" });
    }

    const normalizedEmail = normalizeEmail(email);
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "email already registered" });
    }

    const passwordHash = hashPassword(password);
    const user = await User.create({
      username: username.trim(),
      email: normalizedEmail,
      image: image || "",
      passwordHash,
    });

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res
        .status(500)
        .json({ success: false, message: "JWT_SECRET not configured" });
    }

    const token = signJwt({ sub: user._id }, secret, { expiresInSeconds: 60 * 60 * 24 * 7 });

    return res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        image: user.image,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "email and password required" });
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail }).select("+passwordHash");
    if (!user || !user.passwordHash) {
      return res.status(401).json({ success: false, message: "invalid credentials" });
    }

    const ok = verifyPassword(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ success: false, message: "invalid credentials" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res
        .status(500)
        .json({ success: false, message: "JWT_SECRET not configured" });
    }

    const token = signJwt({ sub: user._id }, secret, { expiresInSeconds: 60 * 60 * 24 * 7 });

    return res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        image: user.image,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const me = async (req, res) => {
  return res.json({
    success: true,
    user: {
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      image: req.user.image,
      role: req.user.role,
    },
  });
};

