export const getProfile = async (req, res) => {
    try {
        res.status(200).json({
            id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            role: req.user.role,
            status: "Active",
            title: req.user.role === "admin" ? "ARCANE OVERSEER" : "THE BLACK SWORDSMAN",
            avatar: null
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to load profile" });
    }
};
