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
exports.authOptions = void 0;
const credentials_1 = __importDefault(require("next-auth/providers/credentials"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = __importDefault(require("../config/db"));
const User_model_1 = __importDefault(require("../models/User.model"));
exports.authOptions = {
    providers: [
        (0, credentials_1.default)({
            name: "Credentials",
            credentials: {
                identifier: { label: "Email or Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            authorize(credentials) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield (0, db_1.default)();
                    const user = yield User_model_1.default.findOne({
                        $or: [{ email: credentials.identifier }, { userName: credentials.identifier }],
                    });
                    if (!user)
                        throw new Error("User not found");
                    const isValidPassword = yield bcryptjs_1.default.compare(credentials.password, user.password);
                    if (!isValidPassword)
                        throw new Error("Incorrect password");
                    return user;
                });
            },
        }),
    ],
    callbacks: {
        jwt(_a) {
            return __awaiter(this, arguments, void 0, function* ({ token, user }) {
                if (user) {
                    token._id = user._id.toString();
                    token.userName = user.userName;
                    token.email = user.email;
                    token.isVerified = user.isVerified;
                }
                return token;
            });
        },
        session(_a) {
            return __awaiter(this, arguments, void 0, function* ({ session, token }) {
                if (token) {
                    session.user._id = token._id;
                    session.user.userName = token.userName;
                    session.user.email = token.email;
                    session.user.isVerified = token.isVerified;
                }
                return session;
            });
        },
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
