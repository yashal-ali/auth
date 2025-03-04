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
exports.sendForgetPasswordEmail = sendForgetPasswordEmail;
exports.sendVerificationEmail = sendVerificationEmail;
const VerficationEmail_1 = __importDefault(require("../../emails/VerficationEmail"));
const resend_1 = require("resend");
const react_hot_toast_1 = __importDefault(require("react-hot-toast"));
const ForgetPasswordEmailTemplate_1 = __importDefault(require("../../emails/ForgetPasswordEmailTemplate"));
function sendForgetPasswordEmail(email, username, resetLink) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resend = new resend_1.Resend("re_YL4PZjyW_3z3zuCJioGTXQdAeK4SY6Kno");
            yield resend.emails.send({
                from: 'no-reply@scientconnect.com',
                to: email,
                subject: 'Reset Password Link',
                react: (0, ForgetPasswordEmailTemplate_1.default)(username, resetLink),
            });
            return { success: true, message: 'Verification email sent successfully.' };
        }
        catch (emailError) {
            react_hot_toast_1.default.error('Error sending verification email:', emailError);
            return { success: false, message: 'Failed to send verification email.' };
        }
    });
}
function sendVerificationEmail(email, username, verifyCode) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resend = new resend_1.Resend("re_YL4PZjyW_3z3zuCJioGTXQdAeK4SY6Kno");
            yield resend.emails.send({
                from: 'no-reply@scientconnect.com',
                to: email,
                subject: 'Verification Code Email',
                react: (0, VerficationEmail_1.default)({ username, otp: verifyCode }),
            });
            console.log('verifyCode', verifyCode);
            return { success: true, message: 'Verification email sent successfully.' };
        }
        catch (emailError) {
            react_hot_toast_1.default.error('Error sending verification email:', emailError);
            return { success: false, message: 'Failed to send verification email.' };
        }
    });
}
