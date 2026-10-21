import connectToDB from "../db/db.js";
import ConnectionRequest from "../models/ConnectionRequest.js";
import User from "../models/User.js";

export const getFeed = async (req, res) => {
  try {
    await connectToDB();
    const loggedInUser = req.user;
    let page = Number(req.query.page);
    let limit = Number(req.query.limit);
    limit = limit > 100 ? 100 : limit;
    const skip = Number((page - 1) * limit);

    //In feed the logged in user must not see his own profile and the profiles which have connections with him and the profiles which sent him a conenction request and the profiles to which logged in user has sent request

    //search up connection schema where the logged in user is either sender or receiver
    const connections = await ConnectionRequest.find({
      $or: [
        { fromUser: loggedInUser?._id.toString() },
        { toUser: loggedInUser?._id.toString() },
      ],
    })
      .populate("fromUser", "-password")
      .populate("toUser", "-password");

    //Set datatype is a datatype which cannot contain duplicate entries
    const hideUserFromFeed = new Set();

    //we are storing ids which are already present in connection schema
    connections.forEach((req) => {
      hideUserFromFeed.add(req.fromUser?._id.toString());
      hideUserFromFeed.add(req.toUser?._id.toString());
    });

    //now finding the users which are not already present in connection schema and also logged in user should not see his profile in feed as well
    const user = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        {
          _id: { $ne: loggedInUser?._id.toString() },
        },
      ],
    })
      .skip(skip)
      .limit(limit);

    return res.status(201).json({
      message: "Fetched connections",
      user: user,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

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
