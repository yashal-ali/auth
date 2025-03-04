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
exports.resetPassword = void 0;
const db_1 = __importDefault(require("../config/db"));
const User_model_1 = __importDefault(require("../models/User.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const resetPassword = (token, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.default)();
    const user = yield User_model_1.default.findOne({ resetToken: token });
    if (!user || new Date(user.resetTokenExpiry) < new Date()) {
        return { success: false, message: "Invalid or expired reset token" };
    }
    // Hash the new password
    const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
    // Update user password
    user.password = hashedPassword;
    user.resetToken = (0, uuid_1.v4)(); // Generate a new reset token to invalidate the old one
    yield user.save();
    return { success: true, message: "Password reset successfully" };
});
exports.resetPassword = resetPassword;
