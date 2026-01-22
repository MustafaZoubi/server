import { Router } from "express";
import {
    getMyCart,
    addToCart,
    updateCartItemQty,
    removeCartItem,
    clearCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, getMyCart);
router.post("/add", protect, addToCart);
router.patch("/update/:gameId", protect, updateCartItemQty);
router.delete("/remove/:gameId", protect, removeCartItem);
router.delete("/clear", protect, clearCart);

export default router;
