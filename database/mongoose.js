import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const DB = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(DB);
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;