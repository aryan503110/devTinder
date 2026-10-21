import connectToDB from "../db/db.js";
import ConnectionRequest from "../models/ConnectionRequest.js";
import User from "../models/User.js";

export const sendConnection = async (req, res) => {
  try {
    await connectToDB();

    const user = req.user;
    const { status, touser } = req.params;

    const allowedStatus = ["ignore", "interested"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    if (user?._id.toString() == touser.toString()) {
      return res.status(400).json({
        message: "Cannot send request to yourself",
      });
    }

    // Check whether the recipient exists
    const toUserExists = await User.findById(touser);

    if (!toUserExists) {
      return res.status(404).json({
        message: "User does not exist",
      });
    }

    // Check for a request in either direction
    const existing = await ConnectionRequest.findOne({
      $or: [
        { fromUser: user, toUser: touser },
        { fromUser: touser, toUser: user },
      ],
    });

    if (existing) {
      return res.status(409).json({
        message: "Request already present",
      });
    }

    const newConnection = new ConnectionRequest({
      fromUser: user,
      toUser: touser,
      status,
    });

    await newConnection.save();

    return res.status(201).json({
      message: "Request sent",
      data: newConnection,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const reviewConnection = async (req, res) => {
  try {
    await connectToDB();
    const loggedInUser = req.user;
    const { status, requestId } = req.params;

    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const connection = await ConnectionRequest.findOne({
      _id: requestId,
      toUser: loggedInUser?._id.toString(),
      status: "interested",
    });

    if (!connection) {
      return res.status(400).json({
        message: "No connection request found",
      });
    }

    connection.status = status;

    await connection.save();

    return res.status(201).json({
      message: `Request ${status}`,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
