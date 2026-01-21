import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js";
import app from "./app.js";

dotenv.config();

await connectDB();

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})







