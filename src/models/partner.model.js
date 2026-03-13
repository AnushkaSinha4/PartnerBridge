import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    companyName: {
        type: String,
        required: true
    },

    businessType: {
        type: String
    },

    employeeCount: {
        type: String
    },

    yearOfEstablishment: {
        type: Number
    },

    website: {
        type: String
    },

    linkedinUrl: {
        type: String
    },

    portfolioUrl: {
        type: String
    },

    estimatedRevenue: {
        type: String
    },

    contactName: {
        type: String
    },

    contactRole: {
        type: String
    },

    contactEmail: {
        type: String
    },

    contactPhone: {
        type: String
    },

    preferredContactMethod: {
        type: String,
        enum: ["email", "phone"]
    },

    status: {
        type: String,
        enum: ["in_review", "approved", "rejected"],
        default: "in_review"
    }
}, {
    timestamps: true
});

const Partner = mongoose.model("Partner", partnerSchema);

export default Partner;