import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const DB = process.env.MONGODB_URI;

let isConnected = false;

const connectDB = async () => {
  try {
    if (isConnected) return;

    const db = await mongoose.connect(DB);

    isConnected = db.connections[0].readyState === 1;

    console.log("Database connected");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    throw error;
  }
};

export default connectDB;