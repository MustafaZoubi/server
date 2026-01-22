import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import gameRoutes from "./routes/gameRoutes.js"
import achievementRoutes from "./routes/achievementRoutes.js"
import cartRoutes from "./routes/cartRoutes.js";

const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5174",
    credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/cart", cartRoutes);

export default app;
