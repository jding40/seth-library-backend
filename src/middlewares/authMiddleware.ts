// src/middleware/authMiddleware.ts
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { type IUser } from "../models/User.js";

export interface AuthRequest extends Request {
  user?: IUser; // 把当前登录用户挂载到 req
}

// 验证 JWT
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  //console.log("authenticate====>");
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      //console.log("authheader in authenticate: "+authHeader);
      return res.status(401).json({ message: "No token provided" });
    }

    const token: string | undefined = authHeader.split(" ")[1];
    //console.log("token in authenticate: "+token);
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload;
    //console.log("decoded in authenticate: "+decoded);
    if (!decoded || typeof decoded.id !== "string") {
      return res.status(401).json({ message: "Invalid token format" });
    }

    // 查询用户
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Invalid token user" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// 检查角色
export const authorize =
  (roles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }
    next();
  };
