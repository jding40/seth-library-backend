import { Schema, model, Document, Model } from "mongoose";
const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    tel: { type: String, required: false },
});
const User = model("users", userSchema);
export default User;
//# sourceMappingURL=User.js.map