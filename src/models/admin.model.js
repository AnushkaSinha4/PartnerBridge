import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true
    },

    firstName: String,
    lastName: String,

    status: {
        type: String,
        default: "active"
    },

    otp: String,
    otpExpiry: Date,

    refreshToken: String,
    lastLoginAt: Date

}, { timestamps: true })

export const Admin = mongoose.model("Admin", adminSchema);