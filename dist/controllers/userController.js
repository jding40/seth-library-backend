import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {} from "../middlewares/authMiddleware.js";
import {} from "../models/User.js";
// User sign up
export const registerUser = async (req, res) => {
    try {
        const { email, password, role, firstName, lastName, tel } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "This email address has already been registered..." });
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            password: hashedPassword,
            role: "user",
            firstName,
            lastName,
            tel,
        });
        await newUser.save();
        return res.status(201).json({ message: "Successfully registered" });
    }
    catch (error) {
        return res.status(500).json({ message: "Registration failed...", error });
    }
};
// User login
export const loginUser = async (req, res) => {
    try {
        console.log("loginUser in userController.ts");
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        console.log("user:" + user);
        if (!user)
            return res.status(400).json({ message: "User not found..." });
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("isMatch:" + isMatch);
        if (!isMatch)
            return res.status(400).json({ message: "Incorrect password..." });
        const secret = process.env.JWT_SECRET;
        if (!secret)
            throw new Error("secret is null");
        const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, secret, { expiresIn: "168h" });
        return res.json({ message: "Successfully login", token });
    }
    catch (error) {
        return res.status(500).json({ message: "Failed to login...", error });
    }
};
// Get information of all users(need authorization)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        return res.json(users);
    }
    catch (error) {
        return res.status(500).json({ message: "Failed to get user", error });
    }
};
// Update user(need authorization)
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        //console.log("id:"+id);
        const updates = req.body;
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }
        const user = await User.findByIdAndUpdate(id, updates, { new: true });
        if (!user)
            return res.status(404).json({ message: "User not found..." });
        return res.json(user);
    }
    catch (error) {
        return res.status(500).json({ message: "Update failed", error });
    }
};
// delete user(need authorization)
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user)
            return res.status(404).json({ message: "User not found..." });
        return res.json({ message: "Deletion failed..." });
    }
    catch (error) {
        return res.status(500).json({ message: "Deletion failed...", error });
    }
};
export const switchRole = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("switchRole in userController.ts=> id:" + id);
        // query
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found..." });
        }
        // switch
        const newRole = user.role === "admin" ? "user" : "admin";
        user.role = newRole;
        console.log("new role: ", newRole);
        // save
        await user.save();
        return res.json({ message: "Role switched successfully", user });
    }
    catch (error) {
        console.error("❌ switchRole failed:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
//# sourceMappingURL=userController.js.map