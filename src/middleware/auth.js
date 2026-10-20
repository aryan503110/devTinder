import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies || {};

    if (!token) {
      return res.status(401).json({ message: "Invalid request" });
    }

    const decoded = jwt.verify(token, "secret");

    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (err) {
    console.error(err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
