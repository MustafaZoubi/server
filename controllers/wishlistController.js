import Wishlist from "../models/Wishlist.js";
import Game from "../models/Game.js";

const buildWishlistResponse = async (wishlistDoc) => {
    const wishlist = await wishlistDoc.populate("items.game");

    return {
        _id: wishlist._id,
        items: wishlist.items.map((it) => ({
            game: {
                _id: it.game._id,
                title: it.game.title,
                price: it.game.price,
                platforms: it.game.platforms,
            },
        })),
    };
};

export const getMyWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: req.user._id, items: [] });
        }

        res.json(await buildWishlistResponse(wishlist));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch wishlist" });
    }
};

export const toggleWishlistItem = async (req, res) => {
    try {
        const { gameId } = req.body;
        if (!gameId) return res.status(400).json({ message: "gameId required" });

        const game = await Game.findById(gameId);
        if (!game) return res.status(404).json({ message: "Game not found" });

        let wishlist = await Wishlist.findOne({ user: req.user._id });
        if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, items: [] });

        const exists = wishlist.items.find(
            (i) => String(i.game) === String(gameId)
        );

        if (exists) {
            wishlist.items = wishlist.items.filter(
                (i) => String(i.game) !== String(gameId)
            );
        } else {
            wishlist.items.push({ game: gameId });
        }

        await wishlist.save();
        res.json(await buildWishlistResponse(wishlist));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update wishlist" });
    }
};

export const removeWishlistItem = async (req, res) => {
    try {
        const { gameId } = req.params;

        const wishlist = await Wishlist.findOne({ user: req.user._id });
        if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

        wishlist.items = wishlist.items.filter(
            (i) => String(i.game) !== String(gameId)
        );

        await wishlist.save();
        res.json(await buildWishlistResponse(wishlist));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to remove wishlist item" });
    }
};
