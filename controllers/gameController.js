import Game from "../models/Game.js";
import { getGameImages } from "../services/rawgService.js";


export const getGameById = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) return res.status(404).json({ message: "Game not found" });

        const images = await getGameImages(game.rawgId);

        res.status(200).json({
            ...game.toObject(),
            images,
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to load game" });
    }
};
