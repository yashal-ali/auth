import dbConnect from "../config/db";
import UserModel from "../models/User.model";
import { v4 as uuidv4 } from "uuid"; // Unique reset tokens
import  {sendForgetPasswordEmail } from "../email/sendForgetPasswordEmail";

export const forgotPassword = async (email: string, EmailComponent:React.ElementType , domain:string) => {
  try {
    await dbConnect();

    // Check if user exists
    const user = await UserModel.findOne({ email});
    if (!user) {
      return { success: false, message: "User not found" };
    }

    // Generate reset token and expiry time
    const resetToken = uuidv4();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiry

    // Update user with reset token
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Ensure BASE_URL is defined
    if (!process.env.BASE_URL) {
      console.error("BASE_URL is not set in environment variables.");
      return { success: false, message: "Internal server error" };
    }

    // Construct password reset link
    const resetLink = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;

    // Send email with reset link
    const emailResponse = await sendForgetPasswordEmail(email, user.userName, resetLink,domain , EmailComponent);

    if (!emailResponse.success) {
      console.error("Error sending reset email:", emailResponse.message);
      return { success: false, message: emailResponse.message };
    }

    return { success: true, message: "Password reset email sent successfully." };
  } catch (error) {
    console.error("Error in forgotPassword function:", error);
    return { success: false, message: "Internal server error" };
  }
};
