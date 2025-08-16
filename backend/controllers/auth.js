import jwt from "jsonwebtoken"
import UserModel from "../models/UserModel.js"
import { compareSync } from "@node-rs/bcrypt"
import { ERROR_LOGS_FILE, EXCLUDED_FIELDS } from "../utils/common.js"
import logger from "../middlewares/logger.js";

export const login = async (req, res) => {
    const { email, password } = req.body

    try {
        // Find user by email
        const user = await UserModel.findOne({ email });

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

        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_EXPIRATION, {
            expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION,
        });

        const loginData = await UserModel.findByIdAndUpdate(user._id, {
            $set: {
                refreshToken,
                lastUpdatedBy: user._id
            },
            $currentDate: { lastModified: true }
        }, {
            new: true
        }).select(EXCLUDED_FIELDS)

        console.log('loginData:', loginData)

        res.cookie("jwt", refreshToken, { httpOnly: true, maxAge: 30 * 60 * 60 * 1000 })

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: `${user.firstName} ${user.lastName}`,
                accessToken: `Bearer ${accessToken}`
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
        const existingUser = await UserModel.findOne({ email });
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
                    role: role,
                    token: `Bearer ${accessToken}`
                },
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.toString(),
        });
    }
};

export const logout = (req, res) => {
    req.logout(() => res.status(200).json({
        success: true,
        message: "Logout Successful",
    })
    )
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

    const payload = {
        email: req.user.email,
        id: req.user._id,
    };

    try {
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
        });

        return res.status(200).json({
            success: true,
            message: "New Access Token generated",
            user: {
                id: req.user._id,
                name: `${req.user.firstName} ${req.user.lastName}`,
                accessToken: `Bearer ${accessToken}`
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
