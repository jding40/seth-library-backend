// src/routes/borrowRecordRoutes.ts
import express from "express";
import BorrowRecordController from "../controllers/BorrowRecordController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
const borrowRecordRouter = express.Router();
// 📖 查询（公开接口）
borrowRecordRouter.get("/", authenticate, authorize(["admin"]), BorrowRecordController.getAll);
borrowRecordRouter.get("/:id", authenticate, authorize(["admin"]), BorrowRecordController.getById);
// 🔒 管理（必须登录 + admin）
borrowRecordRouter.post("/", authenticate, authorize(["admin"]), BorrowRecordController.create);
borrowRecordRouter.put("/:id", authenticate, authorize(["admin"]), BorrowRecordController.update);
borrowRecordRouter.delete("/:id", authenticate, authorize(["admin"]), BorrowRecordController.delete);
export default borrowRecordRouter;
//# sourceMappingURL=borrowRecordRoutes.js.map