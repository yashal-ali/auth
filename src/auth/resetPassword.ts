import dbConnect from "../config/db";
import UserModel from "../models/User.model";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";


export const resetPassword = async (token: string, newPassword: string) => {
  await dbConnect();

  const user = await UserModel.findOne({ resetToken: token });

  if (!user || new Date(user.resetTokenExpiry) < new Date()) {
    return { success: false, message: "Invalid or expired reset token" };
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update user password
  user.password = hashedPassword;
  user.resetToken = uuidv4(); // Generate a new reset token to invalidate the old one
  await user.save();

  return { success: true, message: "Password reset successfully" };
};
