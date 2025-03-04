import dbConnect from "../config/db";
import UserModel from "../models/User.model";

export const verifyUser = async (userName: string, code: string) => {
  await dbConnect();

  const decodedUsername = decodeURIComponent(userName);
  const user = await UserModel.findOne({ userName: decodedUsername });

  if (!user) {
    return { success: false, message: "User not found" };
  }

  const isCodeValid = user.verifyCode === code;
  const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

  if (isCodeValid && isCodeNotExpired) {
    user.isVerified = true;
    await user.save();
    return { success: true, message: "Account verified successfully" };
  } else if (!isCodeNotExpired) {
    return { success: false, message: "Verification code expired. Please request a new one." };
  } else {
    return { success: false, message: "Incorrect verification code" };
  }
};
