import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema(
  {
    fromUser: { type: mongoose.Schema.Types.ObjectId },
    toUser: { type: mongoose.Schema.Types.ObjectId },
    status: {
      type: String,
      enum: ["ignore", "accepted", "interested", "rejected"],
    },
  },
  { timestamps: true },
);

export default mongoose.model("Connection", connectionSchema);
