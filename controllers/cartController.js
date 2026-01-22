import Cart from "../models/Cart.js";
import Game from "../models/Game.js";

const buildCartResponse = async (cartDoc) => {
    const cart = await cartDoc.populate("items.game");

    const subtotal = cart.items.reduce((sum, item) => {
        const price = item.game?.price || 0;
        return sum + price * item.quantity;
    }, 0);

    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    return {
        _id: cart._id,
        user: cart.user,
        items: cart.items.map((it) => ({
            game: {
                _id: it.game?._id,
                title: it.game?.title,
                price: it.game?.price,
                platforms: it.game?.platforms,
            },
            quantity: it.quantity,
            lineTotal: (it.game?.price || 0) * it.quantity,
        })),
        subtotal,
        totalItems,
    };
};

export const getMyCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        return res.json(await buildCartResponse(cart));
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to fetch cart" });
    }
};

export const addToCart = async (req, res) => {
    try {
        const { gameId, quantity = 1 } = req.body;

        if (!gameId) return res.status(400).json({ message: "gameId is required" });

        const game = await Game.findById(gameId);
        if (!game) return res.status(404).json({ message: "Game not found" });

        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

        const qty = Math.max(1, Math.min(99, Number(quantity) || 1));

        const existing = cart.items.find((i) => String(i.game) === String(gameId));
        if (existing) existing.quantity = Math.min(99, existing.quantity + qty);
        else cart.items.push({ game: gameId, quantity: qty });

        await cart.save();
        return res.json(await buildCartResponse(cart));
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to add to cart" });
    }
};

export const updateCartItemQty = async (req, res) => {
    try {
        const { gameId } = req.params;
        const { quantity } = req.body;

        const qty = Number(quantity);
        if (!qty || qty < 1 || qty > 99) {
            return res.status(400).json({ message: "quantity must be 1-99" });
        }

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const item = cart.items.find((i) => String(i.game) === String(gameId));
        if (!item) return res.status(404).json({ message: "Item not found in cart" });

        item.quantity = qty;
        await cart.save();

        return res.json(await buildCartResponse(cart));
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to update cart item" });
    }
};

export const removeCartItem = async (req, res) => {
    try {
        const { gameId } = req.params;

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter((i) => String(i.game) !== String(gameId));
        await cart.save();

        return res.json(await buildCartResponse(cart));
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to remove cart item" });
    }
};

export const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = [];
        await cart.save();

        return res.json(await buildCartResponse(cart));
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to clear cart" });
    }
};
