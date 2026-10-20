import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectToDB from "../db/db.js";

export const signUp = async (req, res) => {
  try {
    await connectToDB();
    const { firstName, lastName, email, password, age, gender, skills, about } =
      req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      age,
      gender,
      skills,
      about,
    });

    await newUser.save();

    return res.json({ message: "User Created" });
  } catch (err) {
    return res.json({ message: "Error", err });
  }
};

export const login = async (req, res) => {
  try {
    await connectToDB();
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: "Invalid Credentials", success: false });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
      return res.json({ message: "Invalid Credentials", success: false });
    }

    const token = await jwt.sign(
      { userId: user._id, email: user.email },
      "secret",
    );

    res.cookie("token", token);

    return res.json({ message: "User Logged In" });
  } catch (err) {
    return res.json({ message: "Error", err });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ message: "User logged out" });
  } catch (err) {
    return res.json({ message: "Error", err });
  }
};
