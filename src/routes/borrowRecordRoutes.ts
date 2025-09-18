// src/routes/borrowRecordRoutes.ts
import express from "express";
import BorrowRecordController from "../controllers/BorrowRecordController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";

const borrowRecordRouter = express.Router();

// 📖 query(public interface)
borrowRecordRouter.get("/", authenticate, authorize(["admin"]), BorrowRecordController.getAll);
borrowRecordRouter.get("/:id", authenticate, authorize(["admin"]), BorrowRecordController.getById);

// 🔒 management(user role must be admin)
borrowRecordRouter.post("/", authenticate, authorize(["admin"]), BorrowRecordController.create);
borrowRecordRouter.put("/:id", authenticate, authorize(["admin"]), BorrowRecordController.update);
borrowRecordRouter.delete("/:id", authenticate, authorize(["admin"]), BorrowRecordController.delete);

export default borrowRecordRouter;
