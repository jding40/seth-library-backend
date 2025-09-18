// src/routes/userRoutes.ts
import express from "express";
import { registerUser, loginUser, getAllUsers, deleteUser, updateUser } from "../controllers/userController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
const userRouter = express.Router();
// ✅ public interface
userRouter.post("/register", registerUser); // sign up
userRouter.post("/login", loginUser); // sign in
// 🔒 need to log in
//router.get("/me", authenticate, UserController.getProfile);
// 🔒 user role has to be admin
userRouter.get("/", authenticate, authorize(["admin"]), getAllUsers);
userRouter.delete("/:id", authenticate, authorize(["admin"]), deleteUser);
userRouter.put("/:id", authenticate, authorize(["admin"]), updateUser);
export default userRouter;
//# sourceMappingURL=userRoutes.js.map