import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apierror.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { Admin } from "../models/admin.model.js";
import { PartnerAccount } from "../models/partnerAccount.model.js";
import { EmployeeAccount } from "../models/employeeAccount.model.js";
import { ClientAccount } from "../models/clientAccount.model.js"

import { Organization } from "../models/organization.model.js";
import jwt from "jsonwebtoken";
import { generateOTP } from "../utils/generateOtp.js";
import { sendOtpEmail } from "../utils/sendEmail.js";

/* ================= FIND USER BY EMAIL ================= */
const findUserByEmail = async(email) => {
    let user = await Admin.findOne({ email });
    if (user) return { user, role: "admin", model: Admin };
    user = await PartnerAccount.findOne({ email });
    if (user) return { user, role: "partner", model: PartnerAccount };
    user = await EmployeeAccount.findOne({ email });
    if (user) return { user, role: "employee", model: EmployeeAccount };
    user = await ClientAccount.findOne({ email });
    if (user) return { user, role: "client", model: ClientAccount };
    return null;
};

/* ================= GENERATE TOKENS ================= */
const generateTokens = async(user, role) => {
    const accessToken = jwt.sign({ _id: user._id, email: user.email, role },
        process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign({ _id: user._id },
        process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
};

const setTokenCookies = (res, accessToken, refreshToken) => {
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    };

    res.cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/api/v1/auth/refresh-token",
    });
};

/* ================= SEND OTP ================= */

export const sendOtp = asyncHandler(async(req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new ApiError(400, "Email is required");
    }
    const normalizedEmail = email.toLowerCase().trim();

    const result = await findUserByEmail(normalizedEmail);

    if (!result) {
        throw new ApiError(404, "User not found");
    }
    const { user } = result;
    if (user.status !== "active") {
        throw new ApiError(403, "Your account is " + user.status + ". Please contact admin.");
    }

    const otp = generateOTP();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    // await sendOtpEmail(user.email, otp);

    console.log("OTP:", otp);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "OTP sent successfully"));
});

/* ================= VERIFY OTP / LOGIN ================= */

export const verifyOtp = asyncHandler(async(req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        throw new ApiError(400, "Email and OTP required");
    }
    const normalizedEmail = email.toLowerCase().trim();
    const result = await findUserByEmail(normalizedEmail);
    if (!result) {
        throw new ApiError(401, "Invalid email or OTP");
    }
    const { user, role } = result;
    if (!user.otp || user.otp !== otp) {
        throw new ApiError(401, "Invalid OTP");
    }
    if (user.otpExpiry < Date.now()) {
        throw new ApiError(401, "OTP expired");
    }

    user.otp = null;
    user.otpExpiry = null;
    user.lastLoginAt = new Date();

    await user.save({ validateBeforeSave: false });

    const tokens = await generateTokens(user, role);

    let organization = null;
    if (user.organization) {
        organization = await Organization.findById(user.organization);
    }

    setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

    // const sanitizedUser = user.getSanitizedUser();

    const dashboardRoutes = {
        super_admin: "/super-admin/dashboard",
        admin: "/admin",
        employee: "/employee",
        client: "/client",
        partner: "/partner",
    };

    return res.status(200).json(
        new ApiResponse(200, {
                user: {
                    _id: user._id,
                    email: user.email,
                    role
                },
                organization,
                tokens,
                dashboard: dashboardRoutes[role] || "/"
            },
            "Login successful"
        )
    );
});

/* ================= LOGOUT ================= */

export const logout = asyncHandler(async(req, res) => {

    const { userId, role } = req.user;

    let Model;

    if (role === "admin") Model = Admin;
    if (role === "partner") Model = PartnerAccount;
    if (role === "employee") Model = EmployeeAccount;
    if (role === "client") Model = ClientAccount;
    await Model.findByIdAndUpdate(
        userId, { $unset: { refreshToken: 1 } }
    );
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    };
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", {
        ...cookieOptions,
        path: "/api/v1/auth/refresh-token"
    });
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Logged out successfully"));
});

/* ================= REFRESH TOKEN ================= */

export const refreshAccessToken = asyncHandler(async(req, res) => {

    const incomingRefreshToken =
        (req.cookies && req.cookies.refreshToken) || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {

        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        let user =
            await Admin.findById(decodedToken._id) ||
            await PartnerAccount.findById(decodedToken._id) ||
            await EmployeeAccount.findById(decodedToken._id) ||
            await ClientAccount.findById(decodedToken._id);

        if (!user || user.refreshToken !== incomingRefreshToken) {
            throw new ApiError(401, "Invalid refresh token");
        }

        const tokens = await generateTokens(user);

        setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

        return res.status(200).json(
            new ApiResponse(
                200, {
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                },
                "Access token refreshed"
            )
        );

    } catch (error) {
        throw new ApiError(
            401,
            (error && error.message) || "Invalid refresh token"
        );
    }
});

/* ================= CURRENT USER ================= */

export const getCurrentUser = asyncHandler(async(req, res) => {

    const { _id, role } = req.user;

    let Model;

    if (role === "admin") Model = Admin;
    if (role === "partner") Model = PartnerAccount;
    if (role === "employee") Model = EmployeeAccount;
    if (role === "client") Model = ClientAccount;

    const user = await Model.findById(userId)
        .populate("organization", "name type logo")
        .select("-refreshToken");

    return res.status(200).json(
        new ApiResponse(
            200, {
                user,
                organization: user.organization
            },
            "Current user fetched successfully"
        )
    );
});