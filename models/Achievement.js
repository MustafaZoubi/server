import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
    {
        game: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Game",
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        unlockedPercent: {
            type: Number,
            default: 100,
            immutable: true
        }
    },
    { timestamps: true }
);

export default mongoose.model("Achievement", achievementSchema);
