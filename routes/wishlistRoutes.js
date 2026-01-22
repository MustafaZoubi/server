import { Router } from "express";
import {
    getMyWishlist,
    toggleWishlistItem,
    removeWishlistItem,
} from "../controllers/wishlistController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, getMyWishlist);
router.post("/toggle", protect, toggleWishlistItem);
router.delete("/:gameId", protect, removeWishlistItem);

export default router;
