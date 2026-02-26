// src/models/project.model.js
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Project name is required"],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ["pending", "in-progress", "in-review", "completed"],
        default: "pending"
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high", "urgent"],
        default: "medium"
    },
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true
    },
    previewLink: {
        type: String,
        trim: true
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
    tags: [String]
}, {
    timestamps: true
});

// Update progress based on tasks
projectSchema.methods.updateProgress = async function() {
    const Task = mongoose.model("Task");
    const tasks = await Task.find({ project: this._id });
    
    if (tasks.length === 0) {
        this.progress = 0;
    } else {
        const completedTasks = tasks.filter(t => t.status === "completed").length;
        this.progress = Math.round((completedTasks / tasks.length) * 100);
    }
    
    await this.save();
    return this.progress;
};

export const Project = mongoose.model("Project", projectSchema);