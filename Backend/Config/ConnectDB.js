import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const ConnectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {});
    console.log("Succesfully Connected With Database.");
  } catch (error) {
    console.error("Error Connecting To Database:", error.message);
    process.exit(1);
  }
};

export default ConnectDB;
