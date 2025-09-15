import type { Request, Response, NextFunction } from "express";
import { type IUser } from "../models/User.js";
export interface AuthRequest extends Request {
    user?: IUser;
}
export declare const authenticate: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const authorize: (roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=authMiddleware.d.ts.map