import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apierror.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { User } from "../models/user.model.js";
import { Organization } from "../models/organization.model.js";
import jwt from "jsonwebtoken";

const generateTokens = async(user) => {
    try {
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Token generation error:", error);
        throw new ApiError(
            500,
            (error && error.message) || "Something went wrong while generating tokens"
        );
    }
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

// REGISTER
export const register = asyncHandler(async(req, res) => {
    const { email, password, firstName, lastName, role, companyName, phoneNumber } =
    req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    const userData = {
        email,
        password,
        firstName,
        lastName,
        role: role || "client",
        phoneNumber,
        status: "active",
    };

    if (role === "client" && companyName) {
        userData.companyName = companyName;
    }

    const user = await User.create(userData);

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    return res
        .status(201)
        .json(new ApiResponse(201, { user: createdUser }, "User registered successfully"));
});


// LOGIN
export const login = asyncHandler(async(req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    // Always normalize email
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail }).select("+password");

    if (!user) {
        throw new ApiError(401, "Invalid credentials");
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    if (user.status !== "active") {
        throw new ApiError(
            403,
            "Your account is " + user.status + ". Please contact admin."
        );
    }

    user.lastLoginAt = new Date();
    await user.save({ validateBeforeSave: false });

    const tokens = await generateTokens(user);

    let organization = null;
    if (user.organization) {
        organization = await Organization.findById(user.organization);
    }

    setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

    const sanitizedUser = user.getSanitizedUser();

    const dashboardRoutes = {
        super_admin: "/super-admin/dashboard",
        admin: "/admin",
        employee: "/employee",
        client: "/client",
        partner: "/partner",
    };

    return res.status(200).json(
        new ApiResponse(
            200, {
                user: sanitizedUser,
                organization,
                tokens,
                dashboard: dashboardRoutes[user.role] || "/",
            },
            "Login successful"
        )
    );
});

// LOGOUT
export const logout = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id, { $unset: { refreshToken: 1 } }, { new: true }
    );

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    };

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", {
        ...cookieOptions,
        path: "/api/v1/auth/refresh-token",
    });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Logged out successfully"));
});

// REFRESH TOKEN
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

        const user = await User.findById(decodedToken._id);

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

// CURRENT USER
export const getCurrentUser = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id)
        .populate("organization", "name type logo")
        .select("-password -refreshToken");

    return res.status(200).json(
        new ApiResponse(
            200, {
                user: user.getSanitizedUser(),
                organization: user.organization,
            },
            "Current user fetched successfully"
        )
    );
});