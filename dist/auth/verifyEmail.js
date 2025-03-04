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
exports.verifyUser = void 0;
const db_1 = __importDefault(require("../config/db"));
const User_model_1 = __importDefault(require("../models/User.model"));
const verifyUser = (userName, code) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.default)();
    const decodedUsername = decodeURIComponent(userName);
    const user = yield User_model_1.default.findOne({ userName: decodedUsername });
    if (!user) {
        return { success: false, message: "User not found" };
    }
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
    if (isCodeValid && isCodeNotExpired) {
        user.isVerified = true;
        yield user.save();
        return { success: true, message: "Account verified successfully" };
    }
    else if (!isCodeNotExpired) {
        return { success: false, message: "Verification code expired. Please request a new one." };
    }
    else {
        return { success: false, message: "Incorrect verification code" };
    }
});
exports.verifyUser = verifyUser;
