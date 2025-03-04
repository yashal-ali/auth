import { registerUser } from "./auth/register";
import { forgotPassword } from "./auth/forgetPassword";
import { verifyUser } from "./auth/verifyEmail";
import { authOptions } from "./auth/nextAuth";
import dbConnect from "./config/db";
import UserModel from "./models/User.model";
import { resetPassword } from "./auth/resetPassword";

export function isWDS(str: string): boolean {
  return str === "WDS";
}

export {
  registerUser,
  forgotPassword,
  verifyUser,
  resetPassword,
  authOptions,
  dbConnect,
  UserModel,
};
