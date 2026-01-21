import Game from "../models/Game.js";
import { getGameImages } from "../services/rawgService.js";

export const getAllGames = async (req, res) => {
    try {
        const games = await Game.find();

        const enriched = await Promise.all(
            games.map(async (game) => {
                try {
                    const images = await getGameImages(game.rawgId);
                    return { ...game.toObject(), images };
                } catch (err) {
                    console.error("RAWG failed for:", game.title);
                    return {
                        ...game.toObject(),
                        images: { background: null, screenshots: [] }
                    };
                }
            })
        );

        res.json(enriched);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch games" });
    }
};

export const getGameById = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) {
            return res.status(404).json({ message: "Game not found" });
        }

        let images;
        try {
            images = await getGameImages(game.rawgId);
        } catch {
            images = { background: null, screenshots: [] };
        }

        res.json({ ...game.toObject(), images });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch game" });
    }
};
