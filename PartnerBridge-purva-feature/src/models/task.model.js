// src/models/task.model.js
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Task title is required"],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ["todo", "in-progress", "in-review", "completed", "blocked"],
        default: "todo"
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high", "urgent"],
        default: "medium"
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    timeEstimate: {
        type: Number, // in hours
        min: 0
    },
    timeSpent: {
        type: Number, // in hours
        default: 0,
        min: 0
    },
    dueDate: {
        type: Date
    },
    startDate: {
        type: Date
    },
    completedDate: {
        type: Date
    },
    attachments: [{
        filename: String,
        url: String,
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    tags: [String]
}, {
    timestamps: true
});

// Update project progress when task status changes
taskSchema.post("save", async function() {
    const Project = mongoose.model("Project");
    const project = await Project.findById(this.project);
    if (project) {
        await project.updateProgress();
    }
});

taskSchema.post("findOneAndUpdate", async function() {
    const doc = await this.model.findOne(this.getQuery());
    if (doc) {
        const Project = mongoose.model("Project");
        const project = await Project.findById(doc.project);
        if (project) {
            await project.updateProgress();
        }
    }
});

export const Task = mongoose.model("Task", taskSchema);