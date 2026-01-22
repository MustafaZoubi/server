import dotenv from "dotenv"
dotenv.config();

import connectDB from "./config/db.js";
import app from "./app.js";


await connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0,0,0,0", () => {
    console.log(`Listening on port ${PORT}`);
})







