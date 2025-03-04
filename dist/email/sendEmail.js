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
exports.sendEmail = sendEmail;
const resend_1 = require("resend");
const react_hot_toast_1 = __importDefault(require("react-hot-toast"));
const resend = new resend_1.Resend(process.env.RESEND_API_KEY || "");
function sendEmail(email, subject, EmailComponent, domain) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield resend.emails.send({
                from: domain,
                to: email,
                subject,
                react: EmailComponent,
            });
            return { success: true, message: "Email sent successfully." };
        }
        catch (emailError) {
            react_hot_toast_1.default.error(`Error sending email: ${emailError.message}`);
            return { success: false, message: "Failed to send email." };
        }
    });
}
