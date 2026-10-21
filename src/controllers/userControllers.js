import connectToDB from "../db/db.js";
import ConnectionRequest from "../models/ConnectionRequest.js";
import User from "../models/User.js";

export const getConnectionsRequests = async (req, res) => {
  try {
    await connectToDB();
    const loggedInUser = req.user;

    const connections = await ConnectionRequest.find({
      toUser: loggedInUser?._id.toString(),
      status: "interested",
    })
      .populate("fromUser", "-password")
      .populate("toUser", "-password");

    if (!connections) {
      return res.status(400).json({
        message: "No connections found",
      });
    }

    return res.status(201).json({
      message: "Fetched connections",
      connections: connections,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getConnectionsAccepted = async (req, res) => {
  try {
    await connectToDB();
    const loggedInUser = req.user;

    const connections = await ConnectionRequest.find({
      $or: [
        { fromUser: loggedInUser?._id.toString(), status: "accepted" },
        { toUser: loggedInUser?._id.toString(), status: "accepted" },
      ],
    })
      .populate("fromUser", "-password")
      .populate("toUser", "-password");

    if (!connections) {
      return res.status(400).json({
        message: "No connections found",
      });
    }

    const data = connections?.map((item) => {
      if (item?.fromUser?._id.toString() === loggedInUser?._id.toString()) {
        return item.toUser;
      }
      return item.fromUser;
    });

    return res.status(201).json({
      message: "Fetched connections",
      data: data,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
