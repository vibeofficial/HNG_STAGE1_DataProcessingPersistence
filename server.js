import dotenv from "dotenv";
dotenv.config();

import connectDB from "./database/mongoose.js";

import express from "express";
import profileRouter from "./routes/profile.js";
import cors from "cors";
const app = express();
const PORT = process.env.PORT;

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).json({ status: "ok" });
});

app.use('/api', profileRouter);

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});