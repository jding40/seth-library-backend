// src/routes/userRoutes.ts
import express from "express";
import {registerUser,  loginUser, getAllUsers, deleteUser, updateUser, switchRole }from "../controllers/userController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

// ✅ public interface
userRouter.post("/register", registerUser);  // sign up
userRouter.post("/login", loginUser);        // sign in

// 🔒 need to log in
//router.get("/me", authenticate, UserController.getProfile);

// 🔒 user role has to be admin
userRouter.get("/", authenticate, authorize(["admin", "owner"]), getAllUsers);

userRouter.get("/switch-role/:id", authenticate, authorize(["admin", "owner"]), switchRole);


userRouter.delete("/:id", authenticate, authorize(["admin", "owner"]), deleteUser);

userRouter.put("/:id", authenticate, authorize(["admin", "owner"]), updateUser);


export default userRouter;
