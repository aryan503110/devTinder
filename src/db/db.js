import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    mongoose.connect("mongodb://localhost:27017/devTinder");
    console.log("Connected to Database")
  } catch (err) {
    console.log(err, "Error connecting to Database");
  }
};

export default connectToDB;
