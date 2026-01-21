import Achievement from "../models/Achievement.js";

export const getGameAchievements = async (req, res) => {
    try {
        const achievements = await Achievement.find({
            game: req.params.gameId
        });

        res.json(achievements);
    } catch (err) {
        res.status(500).json({ message: "Failed to load achievements" });
    }
};
