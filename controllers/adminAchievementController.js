// controllers/adminAchievementController.js
import Achievement from "../models/Achievement.js";
import Game from "../models/Game.js";

/* GET ALL */
export const getAllAchievements = async (req, res) => {
    const achievements = await Achievement.find().populate("game");
    res.json(achievements);
};

/* CREATE */
export const createAchievement = async (req, res) => {
    const { title, description, game } = req.body;

    if (!title || !description || !game) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await Game.findById(game);
    if (!exists) {
        return res.status(404).json({ message: "Game not found" });
    }

    const achievement = await Achievement.create({
        title,
        description,
        game,
    });

    res.status(201).json(achievement);
};

/* UPDATE */
export const updateAchievement = async (req, res) => {
    const { title, description, game } = req.body;

    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) {
        return res.status(404).json({ message: "Achievement not found" });
    }

    achievement.title = title ?? achievement.title;
    achievement.description = description ?? achievement.description;
    achievement.game = game ?? achievement.game;

    await achievement.save();
    res.json(achievement);
};

/* DELETE */
export const deleteAchievement = async (req, res) => {
    await Achievement.findByIdAndDelete(req.params.id);
    res.json({ message: "Achievement deleted" });
};
