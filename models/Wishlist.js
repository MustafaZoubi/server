import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        items: [
            {
                game: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Game",
                    required: true,
                },
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model("Wishlist", wishlistSchema);
