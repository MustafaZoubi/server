import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema({
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game",
        required: true
    },
    title: String,
    description: String
});

export default mongoose.model("Achievement", achievementSchema);
