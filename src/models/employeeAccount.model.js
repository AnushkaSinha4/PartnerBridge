import mongoose from "mongoose";

const employeeAccountSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true
    },

    firstName: String,
    lastName: String,

    role: {
        type: String,
        default: "employee"
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

export const EmployeeAccount = mongoose.model("EmployeeAccount", employeeAccountSchema);