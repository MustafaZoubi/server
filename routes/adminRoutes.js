import { Router } from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";


import {
    getAllUsers,
    createUser,
    updateUser,
    updateUserRole,
    deleteUser,
} from "../controllers/adminUserController.js";


import {
    getAllGames,
    createGame,
    updateGame,
    deleteGame,
} from "../controllers/adminGameController.js";


import {
    getAllAchievements,
    createAchievement,
    updateAchievement,
    deleteAchievement,
} from "../controllers/adminAchievementController.js";

const router = Router();


router.get("/users", protect, adminOnly, getAllUsers);
router.post("/users", protect, adminOnly, createUser);
router.put("/users/:id", protect, adminOnly, updateUser);
router.patch("/users/:id/role", protect, adminOnly, updateUserRole);
router.delete("/users/:id", protect, adminOnly, deleteUser);


router.get("/games", protect, adminOnly, getAllGames);
router.post("/games", protect, adminOnly, createGame);
router.put("/games/:id", protect, adminOnly, updateGame);
router.delete("/games/:id", protect, adminOnly, deleteGame);


router.get("/achievements", protect, adminOnly, getAllAchievements);
router.post("/achievements", protect, adminOnly, createAchievement);
router.put("/achievements/:id", protect, adminOnly, updateAchievement);
router.delete("/achievements/:id", protect, adminOnly, deleteAchievement);

export default router;
