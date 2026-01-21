import { Router } from "express";
import { getAchievementsByGame } from "../controllers/achievementController.js";

const router = Router();

router.get("/game/:gameId", getAchievementsByGame);

export default router;
