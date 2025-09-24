// src/routes/borrowRecordRoutes.ts
import express from "express";
import BorrowRecordController from "../controllers/BorrowRecordController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";

const borrowRecordRouter = express.Router();

// 📖 query(public interface)
borrowRecordRouter.get("/", authenticate, authorize(["admin", "owner"]), BorrowRecordController.getAll);
borrowRecordRouter.get("/:id", authenticate, authorize(["admin", "owner"]), BorrowRecordController.getById);
borrowRecordRouter.patch("/toggle-bad-debt/:id", authenticate, authorize(["admin", "owner"]), BorrowRecordController.toggleBadDebt);
borrowRecordRouter.patch("/toggle-returned/:id", authenticate, authorize(["admin", "owner"]), BorrowRecordController.handleReturn);



// 🔒 management(user role must be admin)
borrowRecordRouter.post("/", authenticate, authorize(["admin", "owner"]), BorrowRecordController.create);
borrowRecordRouter.put("/:id", authenticate, authorize(["admin", "owner"]), BorrowRecordController.update);
borrowRecordRouter.delete("/:id", authenticate, authorize(["admin", "owner"]), BorrowRecordController.delete);

export default borrowRecordRouter;
