import Game from "../models/Game.js";

export const getAllGames = async (req, res) => {
    const games = await Game.find().sort({ createdAt: -1 });
    res.json(games);
};

export const createGame = async (req, res) => {
    const game = await Game.create(req.body);
    res.status(201).json(game);
};

export const updateGame = async (req, res) => {
    const game = await Game.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    if (!game) {
        return res.status(404).json({ message: "Game not found" });
    }

    res.json(game);
};

// DELETE game
export const deleteGame = async (req, res) => {
    await Game.findByIdAndDelete(req.params.id);
    res.json({ message: "Game deleted" });
};
