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
        trim: true,
        default: ""
    },
    status: {
        type: String,
        enum: ["active", "completed", "on-hold", "cancelled"],
        default: "active"
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high", "urgent"],
        default: "medium"
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: false // Temporarily make it optional
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    dueDate: {
        type: Date
    },
    previewLink: {
        type: String,
        trim: true
    },
    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        role: {
            type: String,
            enum: ["owner", "manager", "member", "viewer"],
            default: "member"
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task"
    }]
}, {
    timestamps: true
});

// Update project progress (if you have this method)
projectSchema.methods.updateProgress = async function() {
    const Task = mongoose.model("Task");
    const tasks = await Task.find({ project: this._id });
    
    if (tasks.length > 0) {
        const completedTasks = tasks.filter(t => t.status === "completed").length;
        this.progress = Math.round((completedTasks / tasks.length) * 100);
    } else {
        this.progress = 0;
    }
    
    await this.save();
};

export const Project = mongoose.model("Project", projectSchema);