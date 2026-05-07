import jwt from "jsonwebtoken"
import UserModel from "../models/UserModel.js"
import { compareSync, hashSync } from "@node-rs/bcrypt"
import { ERROR_LOGS_FILE, EXCLUDED_FIELDS } from "../utils/common.js"
import logger from "../middlewares/logger.js";
import { resend } from "../config/resend.js";

export const login = async (req, res) => {
    const { email, password } = req.body

    try {
        // Find user by email
        const sanitizedEmail = String(email).trim().toLowerCase();
        const user = await UserModel.findOne({ sanitizedEmail });

        if (!user || !compareSync(password, user.password)) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password",
                error: "Invalid credentials",
            });
        }

        const payload = {
            email: email,
            id: user._id,
        };

        const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
        });

        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY, {
            expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION,
        });

        const loginData = await UserModel.findByIdAndUpdate(user._id, {
            $push: {
                refreshTokens: {
                    $each: [
                        {
                            token: refreshToken,
                            userAgent: req.headers["user-agent"],
                        },
                    ],
                    $slice: -5,
                },
            },
            $set: {
                lastUpdatedBy: user._id,
                lastLoginAt: new Date(),
            },
        });

        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                email: user.email,
                mobile: user.mobile,
                dob: user.dob,
                name: `${user.firstName} ${user.lastName}`,
                role: user.role
            },
            tokens: {
                accessToken: accessToken
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.toString(),
        });
    }
}

export const signup = async (req, res) => {
    const { firstName, lastName, email, password, mobile, dob, role } = req.body;

    try {
        // check if user already exists
        const sanitizedEmail = String(email).trim().toLowerCase();
        const existingUser = await UserModel.findOne({ sanitizedEmail });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already exists",
                error: "Conflicting email! If you are already registered, please go to login. Else, please check your email address.",
            })
        } else {
            // Create new user
            const newUser = await UserModel.create({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                mobile: mobile,
                dob: dob,
                role: role
            });

            const payload = {
                email: email,
                id: newUser._id,
            };

            const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
                expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
            });

            return res.status(201).json({
                success: true,
                message: "User created successfully",
                user: {
                    id: newUser._id,
                    name: `${newUser.firstName} ${newUser.lastName}`,
                    email: email,
                    mobile: mobile,
                    dob: dob,
                    role: role
                },
                tokens: {
                    accessToken: accessToken
                }
            });
        }
    } catch (error) {
        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyPattern || {})[0] || "field";

            return res.status(409).json({
                success: false,
                message: `${duplicateField} already exists`,
                error: error.toString(),
            });
        }

        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.toString(),
        });
    }
};

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.jwt;

        if (refreshToken) {
            try {
                const decoded = jwt.verify(
                    refreshToken,
                    process.env.JWT_REFRESH_SECRET_KEY
                );

                await UserModel.findByIdAndUpdate(decoded.id, {
                    $pull: {
                        refreshTokens: {
                            token: refreshToken,
                        },
                    },

                    $set: {
                        lastLogoutAt: new Date(),
                    },
                });
            } catch (error) {
                // invalid token → still clear cookie
                console.log(error);
                logger(error, 'errorLogs.txt')
            }
        }

        res.clearCookie("jwt", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite:
                process.env.NODE_ENV === "production"
                    ? "none"
                    : "lax",
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Logout failed",
            error: error.toString(),
        });
    }
};

export const logoutAll = async (req, res) => {
    await UserModel.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshTokens: [],
            lastLogoutAt: new Date()
        }
    })
    res.clearCookie("jwt");
}

export const handleRefreshToken = async (req, res) => {

    console.log('refresh', req.cookies)

    if (req.error) {
        return res.status(401).json({
            success: false,
            message: `Unauthorized! Please check for valid credentials.`,
            error: req.error.toString()
        })
    } else if (!req.user) {
        return res.status(403).json({
            success: false,
            message: `Forbidden! Invalid user. Please login again`,
            error: req.error.toString()
        })
    }

    try {
        const payload = {
            email: req.user.email,
            id: req.user._id,
        };

        // Generate new access token
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
        });

        // Generate new refresh token
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY, {
            expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION,
        });

        // Update refresh token in DB
        const oldRefreshToken = req.cookies.jwt;

        await UserModel.findByIdAndUpdate(req.user._id, {
            $pull: {
                refreshTokens: {
                    token: oldRefreshToken,
                },
            },
            $push: {
                refreshTokens: {
                    $each: [
                        {
                            token: refreshToken,
                            userAgent: req.headers["user-agent"],
                        },
                    ],
                    $slice: -5,
                },
            },
            $set: {
                lastUpdatedBy: req.user._id,
                lastTokenRefreshAt: new Date(),
            },
        });

        // Send new refresh token as cookie
        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: "New Access Token generated",
            user: {
                id: req.user._id,
                email: req.user.email,
                mobile: req.user.mobile,
                dob: req.user.dob,
                name: `${req.user.firstName} ${req.user.lastName}`
            },
            tokens: {
                accessToken: accessToken
            }
        });
    } catch (error) {
        logger(handleRefreshToken.name + ': ' + error.toString(), ERROR_LOGS_FILE);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.toString()
        })
    }
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const sanitizedEmail = String(email).trim().toLowerCase();

    try {
        const user = await UserModel.findOne({ sanitizedEmail });

        // always return success
        if (!user) {
            return res.status(200).json({
                success: true,
                message:
                    "If an account exists, a password reset link has been sent.",
            });
        }

        const resetToken = jwt.sign(
            {
                id: user._id,
                email: user.email,
                type: "password-reset",
            },
            process.env.JWT_PASSWORD_RESET_SECRET,
            {
                expiresIn: process.env.JWT_PASSWORD_RESET_TOKEN_EXPIRATION,
            }
        );

        const resetLink =
            `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

        await resend.emails.send({
            from: "Expense Manager <no-reply@amankriet.com>",
            to: email,
            subject: "Reset your password",
            html: `
                <h2>Password Reset</h2>
                <p>Click below to reset your password:</p>
                <a href="${resetLink}">Reset Password</a>
            `,
        });

        return res.status(200).json({
            success: true,
            message:
                "If an account exists, a password reset link has been sent.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.toString(),
        });
    }
};

export const resetPassword = async (req, res) => {
    const { token, password } = req.body;

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_PASSWORD_RESET_SECRET
        );

        if (decoded.type !== "password-reset") {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }

        const hashedPassword = hashSync(password, 10);

        await UserModel.findByIdAndUpdate(decoded.id, {
            $set: {
                password: hashedPassword,
                refreshTokens: [],
                passwordChangedAt: new Date(),
            },
        });

        return res.status(200).json({
            success: true,
            message: "Password reset successful",
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
            error: error.toString(),
        });
    }
};