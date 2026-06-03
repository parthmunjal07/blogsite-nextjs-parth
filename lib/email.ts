import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key_to_prevent_build_crash");

const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
// If using a custom verified domain, change this to your from address. 
// For resend testing, you might need to use "onboarding@resend.dev" to send to the verified email address
const fromEmail = "onboarding@resend.dev";

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/api/auth/verify-email?token=${token}`;

  await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to verify your email.</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  // Adjust this link based on frontend routes if you have a UI for password reset
  const resetLink = `${domain}/reset-password?token=${token}`;

  await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });
};
