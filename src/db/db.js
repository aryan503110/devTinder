import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    mongoose.connect(process.env.MONGOOSE_STRING);
  } catch (err) {
    console.log(err, "Error connecting to Database");
  }
};

export default connectToDB;
