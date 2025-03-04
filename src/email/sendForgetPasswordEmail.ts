


import { sendEmail } from "./sendEmail";
import { ApiResponse } from "../types/ApiResponse";
import React from "react";

type VerificationEmailProps = {
  username: string;
  resetLink: string,
};

export async function sendForgetPasswordEmail(
  email: string,
  username: string,
  resetLink: string,
  domain: string,
  EmailComponent: React.ElementType
): Promise<ApiResponse> {
  return sendEmail(
    email, 
    "Reset Password Link", 
    React.createElement(EmailComponent, { username,resetLink }),
    domain
  );
}
