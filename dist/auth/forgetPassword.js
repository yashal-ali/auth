"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPassword = void 0;
const db_1 = __importDefault(require("../config/db"));
const User_model_1 = __importDefault(require("../models/User.model"));
const uuid_1 = require("uuid"); // Unique reset tokens
const sendForgetPasswordEmail_1 = require("../email/sendForgetPasswordEmail");
const forgotPassword = (email, EmailComponent, domain) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.default)();
        // Check if user exists
        const user = yield User_model_1.default.findOne({ email });
        if (!user) {
            return { success: false, message: "User not found" };
        }
        // Generate reset token and expiry time
        const resetToken = (0, uuid_1.v4)();
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiry
        // Update user with reset token
        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        yield user.save();
        // Ensure BASE_URL is defined
        if (!process.env.BASE_URL) {
            console.error("BASE_URL is not set in environment variables.");
            return { success: false, message: "Internal server error" };
        }
        // Construct password reset link
        const resetLink = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;
        // Send email with reset link
        const emailResponse = yield (0, sendForgetPasswordEmail_1.sendForgetPasswordEmail)(email, user.userName, resetLink, domain, EmailComponent);
        if (!emailResponse.success) {
            console.error("Error sending reset email:", emailResponse.message);
            return { success: false, message: emailResponse.message };
        }
        return { success: true, message: "Password reset email sent successfully." };
    }
    catch (error) {
        console.error("Error in forgotPassword function:", error);
        return { success: false, message: "Internal server error" };
    }
});
exports.forgotPassword = forgotPassword;
