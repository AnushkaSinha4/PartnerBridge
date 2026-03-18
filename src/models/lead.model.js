import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: String,
    phone: String,
    company: String,
    requirement: String,

    status: {
        type: String,
        enum: ["new", "qualified", "proposal", "won", "lost"],
        default: "new",
    },

    dealValue: {
        type: Number,
        default: 0,
    },

    partnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PartnerAccount",
        required: true,
    },

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EmployeeAccount",
        default: null,
    },
}, { timestamps: true });

export const Lead = mongoose.model("Lead", leadSchema);