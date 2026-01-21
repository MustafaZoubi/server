import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import gameRoutes from "./routes/gameRoutes.js"
const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5174",
    credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/games", gameRoutes);

export default app;
