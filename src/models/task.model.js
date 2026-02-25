import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Task title is required"],
        trim: true,
    },

    description: {
        type: String,
        trim: true,
    },

    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    status: {
        type: String,
        enum: ["todo", "in-progress", "completed"],
        default: "todo",
    },
}, {
    timestamps: true,
});

export const Task = mongoose.model("Task", taskSchema);