import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../db/index.js";
import { User } from "../models/user.model.js";

dotenv.config();

const seedUsers = async() => {
    try {
        await connectDB();

        // Purane users delete (optional for fresh start)
        await User.deleteMany();

        const users = [{
                firstName: "Admin",
                lastName: "User",
                email: "admin@test.com",
                password: "123456",
                role: "admin",
                status: "active",
            },
            {
                firstName: "Employee",
                lastName: "User",
                email: "employee@test.com",
                password: "123456",
                role: "employee",
                status: "active",
            },
            {
                firstName: "Client",
                lastName: "User",
                email: "client@test.com",
                password: "123456",
                role: "client",
                status: "active",
                companyName: "ABC Pvt Ltd",
            },
            {
                firstName: "Partner",
                lastName: "User",
                email: "partner@test.com",
                password: "123456",
                role: "partner",
                status: "active",
                partnerTier: "silver",
                commissionRate: 10,
            },
        ];

        await User.create(users);

        console.log("✅ Seed users inserted");
        process.exit();
    } catch (error) {
        console.log("❌ Seed error", error);
        process.exit(1);
    }
};

seedUsers();