import Achievement from "../models/Achievement.js";

export const getAllAchievements = async (req, res) => {
    const achievements = await Achievement.find().populate("game");
    res.json(achievements);
};

export const createAchievement = async (req, res) => {
    const achievement = await Achievement.create(req.body);
    res.status(201).json(achievement);
};

export const deleteAchievement = async (req, res) => {
    await Achievement.findByIdAndDelete(req.params.id);
    res.json({ message: "Achievement deleted" });
};
