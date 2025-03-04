import bcrypt from "bcryptjs";
import dbConnect from "../config/db";
import UserModel from "../models/User.model"
import { sendVerificationEmail } from "../email/sendVerificationEmail";

export const registerUser = async ({
  firstName,
  lastName,
  userName,
  email,
  password,
  domain,
  EmailComponent
}: {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  domain: string;
  EmailComponent: React.ElementType;
}) => {
  await dbConnect();

  if (await UserModel.findOne({ userName })) {
    return { success: false, message: "Username already taken" };
  }

  let user = await UserModel.findOne({ email });
  const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedPassword = await bcrypt.hash(password, 10);
  const verifyCodeExpiry = new Date(Date.now() + 3600000);

  if (user) {
    if (user.isVerified) {
      return { success: false, message: "Email already verified" };
    }
    user.password = hashedPassword;
    user.verifyCode = verifyCode;
    user.verifyCodeExpiry = verifyCodeExpiry;
    await user.save();
  } else {
    user = await new UserModel({
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

  const emailResponse = await sendVerificationEmail(email, userName, verifyCode, domain, EmailComponent);
  if (!emailResponse.success) {
    return { success: false, message: emailResponse.message };
  }

  return { success: true, message: "User registered successfully. Please verify your account." };
};
