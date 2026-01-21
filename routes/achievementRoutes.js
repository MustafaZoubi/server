import { Router } from "express";
import { getGameAchievements } from "../controllers/achievementController.js";

const router = Router();

router.get("/game/:gameId", getGameAchievements);

export default router;
