import mongoose from "mongoose";
import { connectDB } from "../config/database.js";

export async function ensureDatabaseConnection(req, res, next) {
    try {
        /**
         * readyState:
         * 0 = disconnected
         * 1 = connected
         * 2 = connecting
         * 3 = disconnecting
         */

        if (mongoose.connection.readyState !== 1) {
            console.log("MongoDB not connected. Reconnecting...");
            await connectDB();
        }

        next();
    } catch (error) {
        console.error("Database connection middleware error:", error);

        return res.status(500).json({
            success: false,
            message: "Database connection failed",
            error: error.toString(),
        });
    }
}