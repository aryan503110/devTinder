import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema(
  {
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["ignore", "interested", "accepted", "rejected"],
    },
  },
  { timestamps: true },
);

//creating index on fromUser and toUser and 1 means ascending
connectionSchema.index({ fromUser: 1, toUser: 1 });

export default mongoose.model("Connection", connectionSchema);
