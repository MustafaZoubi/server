import express from "express"
import connectDB from "./config/db";
import app from "./app";


dotenv.config();

await connectDB();

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})







