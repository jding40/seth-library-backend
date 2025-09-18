import mongoose from "mongoose";
import cors from "cors";
import bookRouter from "./routes/bookRoutes.js";
import userRouter from "./routes/userRoutes.js";
import borrowRecordRouter from "./routes/borrowRecordRoutes.js";
import express, { type Request, type Response } from "express";

import dotenv from "dotenv";

const app = express();
dotenv.config();

// 中间件
app.use(cors());
app.use(express.json());

// routers
app.use("/api/books", bookRouter);
app.use("/api/user", userRouter);
app.use("/api/borrow-record", borrowRecordRouter);

app.get("/", (req, res) => res.json({ designer: "Jianzhong Ding" }));

app.get("/api/test", (req: Request, res: Response) => {
  console.log(process.env.PORT);
  res.json([
    { id: 1, title: "Bible", author: "Unknown" },
    { id: 2, title: "Systematic Theology", author: "Wayne Grudem" },
    { id: 3, title: "The Pilgrim’s Progress", author: "John Bunyan" },
  ]);
});

// MongoDB connection
mongoose.connect(
    "mongodb+srv://jding40:ZwSBamPyxCqmcuon@senecaweb.legcyit.mongodb.net?retryWrites=true&w=majority&appName=SenecaWeb",
    { dbName: "sethLibrary" }
  )
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

export default app;
