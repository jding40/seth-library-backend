import mongoose from "mongoose";
import cors from "cors";
import bookRouter from "./routes/bookRoutes.js";
import userRouter from "./routes/userRoutes.js";
import borrowRecordRouter from "./routes/borrowRecordRoutes.js";
import express, { type Request, type Response } from "express";

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use("/api/books", bookRouter);
app.use("/api/user", userRouter);
app.use("/api/borrow-record", borrowRecordRouter);

app.get("/api/test", (req: Request, res: Response) => {
  res.json([
    { id: 1, title: "圣经", author: "Unknown" },
    { id: 2, title: "Systematic Theology", author: "Wayne Grudem" },
    { id: 3, title: "The Pilgrim’s Progress", author: "John Bunyan" },
  ]);
});

// MongoDB 连接
mongoose
  .connect(
    "mongodb+srv://jding40:ZwSBamPyxCqmcuon@senecaweb.legcyit.mongodb.net?retryWrites=true&w=majority&appName=SenecaWeb",
    { dbName: "sethLibrary" }
  )
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

export default app;
