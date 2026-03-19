import { Lead } from "../models/lead.model.js";

export const createLead = async(req, res) => {
    try {
        const { name, email, phone, company, requirement, dealValue } = req.body;

        const lead = await Lead.create({
            name,
            email,
            phone,
            company,
            requirement,
            dealValue,
            partnerId: req.user._id, // from JWT
        });

        res.status(201).json({
            success: true,
            data: lead,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get leads
export const getLeads = async(req, res) => {
    try {
        let leads;

        if (req.user.role === "partner") {
            leads = await Lead.find({ partnerId: req.user._id });
        } else {
            leads = await Lead.find();
        }

        res.status(200).json({
            success: true,
            data: leads,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// update status
export const updateLeadStatus = async(req, res) => {
    try {
        const { status } = req.body;

        const lead = await Lead.findByIdAndUpdate(
            req.params.id, { status }, { new: true }
        );

        res.status(200).json({
            success: true,
            data: lead,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Assign lead
export const assignLead = async(req, res) => {
    try {
        const { employeeId } = req.body;

        const lead = await Lead.findByIdAndUpdate(
            req.params.id, { assignedTo: employeeId }, { new: true }
        );

        res.status(200).json({
            success: true,
            data: lead,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};