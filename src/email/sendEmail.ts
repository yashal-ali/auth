import { Resend } from "resend";
import toast from "react-hot-toast";
import { ApiResponse } from "../types/ApiResponse";
import React from "react";

const resend = new Resend(process.env.RESEND_API_KEY || "");

export async function sendEmail(
  email: string,
  subject: string,
  EmailComponent: React.ReactElement,
  domain:string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: domain,
      to: email,
      subject,
      react: EmailComponent,
    });

    return { success: true, message: "Email sent successfully." };
  } catch (emailError: any) {
    toast.error(`Error sending email: ${emailError.message}`);
    return { success: false, message: "Failed to send email." };
  }
}
