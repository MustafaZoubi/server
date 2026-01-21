import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
    {
        title: String,
        price: Number,

        rawgId: {
            type: Number,
            required: true,
        },

        genres: [String],

        platforms: {
            pc: Boolean,
            playstation: Boolean,
            xbox: Boolean,
            switch: Boolean,
        },

        releaseDate: Date,
        publisher: String,

        description: String,

        systemRequirements: {
            minimum: {
                os: String,
                cpu: String,
                ram: String,
                gpu: String,
                storage: String,
            },
            recommended: {
                os: String,
                cpu: String,
                ram: String,
                gpu: String,
                storage: String,
            },
        },
    },
    { timestamps: true }
);

export default mongoose.model("Game", gameSchema);
