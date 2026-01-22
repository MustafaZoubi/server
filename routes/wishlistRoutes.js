import { Router } from "express";
import {
    getMyWishlist,
    toggleWishlistItem,
    removeWishlistItem,
} from "../controllers/wishlistController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, getMyWishlist);
router.post("/toggle", authMiddleware, toggleWishlistItem);
router.delete("/:gameId", authMiddleware, removeWishlistItem);

export default router;
