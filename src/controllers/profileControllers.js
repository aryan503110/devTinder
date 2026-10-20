import User from "../models/User.js";
import connectToDB from "../db/db.js";

export const getProfile = async (req, res) => {
  try {
    await connectToDB();
    const user = req.user;
    return res.json({ message: "Fecthed User Profile", user: user });
  } catch (err) {
    return res.json({ message: "Error", err });
  }
};

export const editProfile = async (req, res) => {
  try {
    await connectToDB();

    const user = req.user;
    console.log("user",user)
    const { firstName, lastName, age, gender, skills, about } = req.body;

    const fetchedUser = await User.findByIdAndUpdate(
      user._id,
      {
        firstName,
        lastName,
        age,
        gender,
        skills,
        about,
      },
      { new: true, runValidators: true },
    );

    return res.json({
      message: "Profile updated successfully",
      user: fetchedUser,
    });
  } catch (err) {
    return res.json({ message: "Error", err: err.message });
  }
};
