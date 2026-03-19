import mongoose from "mongoose";

const clientAccountSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true
    },

    firstName: String,
    lastName: String,

    role: {
        type: String,
        default: "client"
    },

    status: {
        type: String,
        default: "active"
    },

    otp: String,
    otpExpiry: Date,

    refreshToken: String,
    lastLoginAt: Date

}, { timestamps: true })

export const ClientAccount = mongoose.model("ClientAccount", clientAccountSchema);