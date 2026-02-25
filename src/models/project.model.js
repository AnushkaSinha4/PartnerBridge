import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Project name is required"],
        trim: true,
    },

    description: {
        type: String,
        trim: true,
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    status: {
        type: String,
        enum: ["active", "completed"],
        default: "active",
    },
}, {
    timestamps: true,
});

export const Project = mongoose.model("Project", projectSchema);