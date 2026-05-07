import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";

export async function verifyRefreshToken(req, res, next) {
    try {
        const refreshToken = req.cookies.jwt;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Missing refresh token",
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET_KEY
        );

        const user = await UserModel.findById(decoded.id);

        if (!user) {
            return res.status(403).json({
                success: false,
                message: "Invalid refresh token",
            });
        }

        const tokenExists = user.refreshTokens.some(
            (item) => item.token === refreshToken
        );

        if (!tokenExists) {
            return res.status(403).json({
                success: false,
                message: "Refresh token revoked",
            });
        }

        req.user = user;
        req.refreshToken = refreshToken;

        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: "Invalid refresh token",
            error: error.toString(),
        });
    }
}