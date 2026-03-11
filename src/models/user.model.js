import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    firstName: {
        type: String,
        required: true,
    },

    lastName: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        enum: ["super_admin", "admin", "employee", "client", "partner"],
        default: "client",
    },

    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
    },

    status: {
        type: String,
        enum: ["active", "inactive", "suspended"],
        default: "active",
    },

    /* ================= OTP LOGIN ================= */

    otp: {
        type: String,
        default: null,
    },

    otpExpiry: {
        type: Date,
        default: null,
    },

    /* ================= TOKENS ================= */

    refreshToken: String,

    lastLoginAt: Date,

}, { timestamps: true });

/* ================= METHODS ================= */

userSchema.methods.generateAccessToken = function() {
    return jwt.sign({
            _id: this._id,
            email: this.email,
            role: this.role,
            organization: this.organization,
        },
        process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" }
    );
};

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign({ _id: this._id },
        process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" }
    );
};

userSchema.methods.getSanitizedUser = function() {
    return {
        _id: this._id,
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        role: this.role,
        organization: this.organization,
        status: this.status,
    };
};

export const User = mongoose.model("User", userSchema);