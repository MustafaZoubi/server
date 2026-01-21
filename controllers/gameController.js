import Game from "../models/Game.js";

export const getAllGames = async (req, res) => {
    try {
        const games = await Game.find();
        res.json(games);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch games" });
    }
};

export const getGameById = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);

        if (!game) {
            return res.status(404).json({ message: "Game not found" });
        }

        res.json(game);
    } catch (err) {
        res.status(400).json({ message: "Invalid game ID" });
    }
};
