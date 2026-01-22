import Game from "../models/Game.js";

export const getAllGames = async (req, res) => {
    res.json(await Game.find());
};

export const createGame = async (req, res) => {
    const game = await Game.create(req.body);
    res.status(201).json(game);
};

export const updateGame = async (req, res) => {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(game);
};

export const deleteGame = async (req, res) => {
    await Game.findByIdAndDelete(req.params.id);
    res.json({ message: "Game deleted" });
};
