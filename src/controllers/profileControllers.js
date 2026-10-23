import User from "../models/User.js";
import connectToDB from "../db/db.js";

export const getProfile = async (req, res) => {
  try {
    await connectToDB();
    const user = req.user;
    return res.json({
      message: "Fecthed User Profile",
      user: {
        userId: user?._id,
        firstName: user?.firstName,
        email: user?.email,
        lastName: user?.lastName,
        imageURL: user?.imageURL,
        age: user?.age,
        gender: user?.gender,
        skills: user?.skills,
        about: user?.about,
      },
    });
  } catch (err) {
    return res.json({ message: "Error", err });
  }
};

export const editProfile = async (req, res) => {
  try {
    await connectToDB();

    const user = req.user;
    const { firstName, lastName, age, imageURL, gender, skills, about } =
      req.body;

    const updateData = {};

    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (age !== undefined) updateData.age = age;
    if (gender !== undefined) updateData.gender = gender;
    if (skills !== undefined) updateData.skills = skills;
    if (about !== undefined) updateData.about = about;
    if (imageURL !== undefined) updateData.imageURL = imageURL;

    const fetchedUser = await User.findByIdAndUpdate(
      user?._id,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (!fetchedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: fetchedUser,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error",
      err: err.message,
    });
  }
};
