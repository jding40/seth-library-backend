import { Schema, model, Document, Model } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  role: string; //"guest" or "admin""
  firstName?: string;
  lastName?: string;
  tel?: string;
  [key: string]: any;
}




const userSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, required: true },
        firstName: { type: String, required: false },
        lastName: { type: String, required: false },
        tel: { type: String, required: false },
    }
)

const User:Model<IUser> = model<IUser>("users", userSchema);

export default User;