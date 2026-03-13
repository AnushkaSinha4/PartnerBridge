import mongoose from "mongoose";

const partnerAccountSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true
    },

    role: {
        type: String,
        default: "partner"
    },

    partnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Partner"
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

export const PartnerAccount = mongoose.model(
    "PartnerAccount",
    partnerAccountSchema
);