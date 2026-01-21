import Achievement from "../models/Achievement.js";

export const getAchievementsByGame = async (req, res) => {
    try {
        const { gameId } = req.params;

        const achievements = await Achievement.find({ game: gameId });

        res.json(achievements);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch achievements" });
    }
};
