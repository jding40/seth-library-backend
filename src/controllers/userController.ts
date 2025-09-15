import type { Request, Response } from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { type AuthRequest } from "../middlewares/authMiddleware.js";
import { type IUser } from "../models/User.js";

// 注册用户
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { email, password, role, firstName, lastName, tel } = req.body;


        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists..." });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hashedPassword,
            role: "guest",
            firstName,
            lastName,
            tel,
        });

        await newUser.save();
        res.status(201).json({ message: "Successfully registered" });
    } catch (error) {
        res.status(500).json({ message: "Registration failed...", error });
    }
};

// 用户登录
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user:IUser | null = await User.findOne({ email }) ;
        console.log("user:"+user);
        if (!user) return res.status(400).json({ message: "User not found..." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect password..." });

        //const secret = process.env.JWT_SECRET || "default_secret";
        const secret:string = "SenecaDiscipleChurch"
        const token:string = jwt.sign(
            { id: user._id, role: user.role, email: user.email },
            secret,
            { expiresIn: "168h" }
        );

        res.json({ message: "Successfully login", token });
    } catch (error) {
        res.status(500).json({ message: "Failed to login...", error });
    }
};

// 获取所有用户（需要鉴权）
export const getAllUsers = async (req: AuthRequest, res: Response) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Failed to get user", error });
    }
};

// 更新用户（需要鉴权）
export const updateUser = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        //console.log("id:"+id);
        const updates = req.body;

        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        const user = await User.findByIdAndUpdate(id, updates, { new: true });
        if (!user) return res.status(404).json({ message: "用户未找到" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "更新失败", error });
    }
};

// 删除用户（需要鉴权）
export const deleteUser = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ message: "用户未找到" });

        res.json({ message: "删除成功" });
    } catch (error) {
        res.status(500).json({ message: "删除失败", error });
    }
};


