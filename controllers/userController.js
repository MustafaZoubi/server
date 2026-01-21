import bcrypt from "bcryptjs";
import User from "../models/User.js";

/**
 * GET /api/user/profile
 */
export const getProfile = async (req, res) => {
    try {
        res.status(200).json({
            id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            role: req.user.role,
            status: "Active",
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to load profile" });
    }
};


export const updateProfile = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (username) user.username = username;
        if (email) user.email = email;

        if (password && password.trim().length > 0) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();

        res.status(200).json({
            message: "Profile updated",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to update profile" });
    }
};
