import { sendEmail } from "./sendEmail";
import { ApiResponse } from "../types/ApiResponse";
import React from "react";

type VerificationEmailProps = {
  username: string;
  otp: string;
};

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string,
  domain: string,
  EmailComponent: React.ElementType
): Promise<ApiResponse> {
  return sendEmail(
    email,
    "Verification Code Email",
    React.createElement(EmailComponent, { username, otp: verifyCode }),
    domain
  );
}
