import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
{
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false,
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

    refreshToken: String,

    lastLoginAt: Date,

    // ✅ OTP fields (for email login)
    
},
{ timestamps: true }
);


/* ================= PASSWORD HASH ================= */

userSchema.pre("save", async function () {

    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);

});


/* ================= METHODS ================= */

userSchema.methods.comparePassword = async function (password) {

    return await bcrypt.compare(password, this.password);

};


userSchema.methods.generateAccessToken = function () {

    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            role: this.role,
            organization: this.organization,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
    );

};


userSchema.methods.generateRefreshToken = function () {

    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );

};


userSchema.methods.getSanitizedUser = function () {

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