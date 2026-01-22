import { Router } from "express";
import { getSimilarGames, getAllGames, getGameById } from "../controllers/gameController.js";

const router = Router();

router.get("/", getAllGames);
router.get("/:id/similar", getSimilarGames);
router.get("/:id", getGameById);

export default router;
