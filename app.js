import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import gameRoutes from "./routes/gameRoutes.js"
import achievementRoutes from "./routes/achievementRoutes.js"
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

app.use(express.json());
app.use(cors({
    origin: [
        "http://localhost:5174",
        "https://client-nu-ten-88.vercel.app"
    ],
    credentials: true
}));
app.get("/", (res, req) => {
    res.send("App is running")
})
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/admin", adminRoutes);

export default app;
