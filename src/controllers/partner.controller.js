import Partner from "../models/partner.model.js";
import { PartnerAccount } from "../models/partnerAccount.model.js";

/* ================================
   Partner: Submit Onboarding Form
================================ */
export const submitPartnerForm = async(req, res) => {
    try {

        // Check if user has partner account
        const account = await PartnerAccount.findOne({
            email: req.user.email
        });
        if (!account) {
            return res.status(403).json({
                message: "Partner account not found"
            });
        }

        // Prevent duplicate onboarding
        const existingPartner = await Partner.findOne({
            userId: req.user._id
        });

        if (existingPartner) {
            return res.status(400).json({
                message: "Onboarding already submitted"
            });
        }

        // ✅ FILE PATHS (if uploaded)
        const aadhaarFront =
            req.files && req.files.aadhaarFront ?
            req.files.aadhaarFront[0].path :
            "";

        const aadhaarBack =
            req.files && req.files.aadhaarBack ?
            req.files.aadhaarBack[0].path :
            "";

        const passportPhoto =
            req.files && req.files.passportPhoto ?
            req.files.passportPhoto[0].path :
            "";
        const partner = await Partner.create({

            userId: req.user._id,

            /* COMPANY */
            companyName: req.body.companyName,
            businessType: req.body.businessType,
            employeeCount: req.body.employeeCount,
            yearOfEstablishment: req.body.yearOfEstablishment,
            website: req.body.website,
            linkedinUrl: req.body.linkedinUrl,
            portfolioUrl: req.body.portfolioUrl,
            estimatedRevenue: req.body.estimatedRevenue,

            /* CONTACT */
            contactName: req.body.contactName,
            contactRole: req.body.contactRole,
            contactEmail: req.body.contactEmail,
            contactPhone: req.body.contactPhone,
            preferredContactMethod: req.body.preferredContactMethod,

            /* BUSINESS DETAILS */
            gstNumber: req.body.gstNumber,
            panNumber: req.body.panNumber,
            bankAccountNumber: req.body.bankAccountNumber,
            ifscCode: req.body.ifscCode,

            /* FILES */
            aadhaarFront,
            aadhaarBack,
            passportPhoto,

            status: "in_review",
        });


        res.status(201).json({
            success: true,
            data: partner
        });

    } catch (error) {

        console.log("ERROR:", error);

        res.status(500).json({
            message: error.message
        });

    }
};

/* ================================
   Partner: Get Current Partner Status
================================ */

export const getPartnerStatus = async(req, res) => {
    try {

        const partner = await Partner.findOne({
            userId: req.user._id
        });

        if (!partner) {
            return res.json({
                success: true,
                data: null
            });
        }

        res.json({
            success: true,
            data: partner
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

/* ================================
   Admin: Get All Partners
================================ */

export const getAllPartners = async(req, res) => {
    try {

        const partners = await Partner.find()
            .populate("userId", "email")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: partners
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

/* ================================
   Admin: Update Partner Status
================================ */

export const updatePartnerStatus = async(req, res) => {
    try {

        const { status } = req.body;

        const partner = await Partner.findByIdAndUpdate(
            req.params.id, { status }, { new: true }
        );

        if (!partner) {
            return res.status(404).json({
                message: "Partner not found"
            });
        }

        res.json({
            message: "Partner status updated",
            data: partner
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};