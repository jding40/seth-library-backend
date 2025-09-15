// src/routes/userRoutes.ts
import express from "express";
import {registerUser,  loginUser, getAllUsers, deleteUser, updateUser }from "../controllers/userController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

// ✅ 公开接口
userRouter.post("/register", registerUser);  // sign up
userRouter.post("/login", loginUser);        // sign in

// 🔒 需要登录
//router.get("/me", authenticate, UserController.getProfile);

// 🔒 需要 admin 权限
userRouter.get("/", authenticate, authorize(["admin"]), getAllUsers);
//userRouter.get("/:id", authenticate, authorize(["admin"]), getAllUsers);
userRouter.delete("/:id", authenticate, authorize(["admin"]), deleteUser);

userRouter.put("/:id", authenticate, authorize(["admin"]), updateUser);


export default userRouter;
