import { Document, Model } from "mongoose";
export interface IUser extends Document {
    email: string;
    password: string;
    role: string;
    firstName?: string;
    lastName?: string;
    tel?: string;
    [key: string]: any;
}
declare const User: Model<IUser>;
export default User;
//# sourceMappingURL=User.d.ts.map