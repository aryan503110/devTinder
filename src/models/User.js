import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    skills: { type: [String] },
    about: { type: String, default: "This is about" },
  },
  { timestamps: true },
);

//compound indexing on first and last name
userSchema.index({ firstName: 1, lastName: 1 });

export default mongoose.model("User", userSchema);
