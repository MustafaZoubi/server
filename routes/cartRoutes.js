import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    getMyCart,
    addToCart,
    updateCartItemQty,
    removeCartItem,
    clearCart,
} from "../controllers/cartController.js";

const router = Router();

router.get("/", protect, getMyCart);
router.post("/add", protect, addToCart);
router.patch("/item/:gameId", protect, updateCartItemQty);
router.delete("/item/:gameId", protect, removeCartItem);
router.post("/clear", protect, clearCart);

export default router;
