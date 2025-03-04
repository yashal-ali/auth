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
exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = __importDefault(require("../config/db"));
const User_model_1 = __importDefault(require("../models/User.model"));
const sendVerificationEmail_1 = require("../email/sendVerificationEmail");
const registerUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ firstName, lastName, userName, email, password, domain, EmailComponent }) {
    yield (0, db_1.default)();
    if (yield User_model_1.default.findOne({ userName })) {
        return { success: false, message: "Username already taken" };
    }
    let user = yield User_model_1.default.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const verifyCodeExpiry = new Date(Date.now() + 3600000);
    if (user) {
        if (user.isVerified) {
            return { success: false, message: "Email already verified" };
        }
        user.password = hashedPassword;
        user.verifyCode = verifyCode;
        user.verifyCodeExpiry = verifyCodeExpiry;
        yield user.save();
    }
    else {
        user = yield new User_model_1.default({
            firstName,
            lastName,
            userName,
            email,
            password: hashedPassword,
            verifyCode,
            verifyCodeExpiry,
            isVerified: false,
        }).save();
    }
    const emailResponse = yield (0, sendVerificationEmail_1.sendVerificationEmail)(email, userName, verifyCode, domain, EmailComponent);
    if (!emailResponse.success) {
        return { success: false, message: emailResponse.message };
    }
    return { success: true, message: "User registered successfully. Please verify your account." };
});
exports.registerUser = registerUser;
