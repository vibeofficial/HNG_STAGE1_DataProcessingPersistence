import dotenv from "dotenv";
dotenv.config();

import connectDB from "./database/mongoose.js";
import express from "express";
import profileRouter from "./routes/profile.js";
import cors from "cors";
import morgan from "morgan";
import serverless from "serverless-http";

const app = express();

app.use(cors({ origin: "*" }));
app.use(morgan("combined"));
app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).json({ status: "ok" });
});

app.use("/api", profileRouter);

connectDB();

export default serverless(app);