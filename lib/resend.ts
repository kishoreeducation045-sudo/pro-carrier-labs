import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export const SENDER_EMAIL = process.env.NEXT_PUBLIC_SENDER_EMAIL || "notifications@procareerlabs.com";

export async function sendWelcomeEmail({
  to,
  name,
  studentId,
}: {
  to: string;
  name: string;
  studentId: string;
}) {
  if (!resend) {
    console.log(`[Resend Mock] Welcome email for ${to} (${studentId})`);
    return { success: true, mocked: true };
  }

  try {
    const data = await resend.emails.send({
      from: `ProCareerLabs <${SENDER_EMAIL}>`,
      to: [to],
      subject: "Welcome to ProCareerLabs! Your Student ID & Access",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f1e; color: #f9fafb; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
          <div style="background: linear-gradient(135deg, #1e6fff, #0a0f1e); padding: 32px 24px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.02em;">Pro<span style="color: #f5a623;">Career</span>Labs</h1>
            <p style="margin: 8px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">Welcome to the next generation of AI upskilling</p>
          </div>
          <div style="padding: 32px 24px;">
            <h2 style="color: #f9fafb; font-size: 20px; margin-top: 0;">Hey ${name || "there"},</h2>
            <p style="color: #94a3b8; font-size: 15px; line-height: 1.6;">
              Your account has been initialized! Here is your official, unique ProCareerLabs student credential:
            </p>
            <div style="background: rgba(30,111,255,0.1); border: 1px solid rgba(30,111,255,0.3); border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
              <span style="font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 4px;">Unique Student ID</span>
              <span style="font-size: 24px; font-weight: 800; color: #f5a623; letter-spacing: 0.05em;">${studentId}</span>
            </div>
            <p style="color: #94a3b8; font-size: 15px; line-height: 1.6;">
              Use this Student ID for verifying certificates, accessing live cohorts, and community support.
            </p>
            <div style="margin-top: 32px; text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard" style="background: #1e6fff; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 700; display: inline-block;">Go to Student Dashboard →</a>
            </div>
          </div>
          <div style="border-top: 1px solid rgba(255,255,255,0.08); padding: 20px; text-align: center; color: #64748b; font-size: 12px;">
            © ${new Date().getFullYear()} ProCareerLabs. All rights reserved.
          </div>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return { success: false, error };
  }
}

export async function sendEnrollmentConfirmationEmail({
  to,
  name,
  courseTitle,
  amount,
  utrId,
  studentId,
  zoomLink,
}: {
  to: string;
  name: string;
  courseTitle: string;
  amount: number;
  utrId: string;
  studentId: string;
  zoomLink?: string;
}) {
  if (!resend) {
    console.log(`[Resend Mock] Enrollment confirmation for ${to}, UTR: ${utrId}`);
    return { success: true, mocked: true };
  }

  try {
    const data = await resend.emails.send({
      from: `ProCareerLabs <${SENDER_EMAIL}>`,
      to: [to],
      subject: `Enrollment Confirmed: ${courseTitle}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f1e; color: #f9fafb; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
          <div style="background: linear-gradient(135deg, #10b981, #0a0f1e); padding: 32px 24px; text-align: center;">
            <div style="font-size: 40px; margin-bottom: 8px;">🎉</div>
            <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 800;">Payment & Enrollment Successful!</h1>
            <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Your seat is 100% secured.</p>
          </div>
          <div style="padding: 32px 24px;">
            <p style="color: #94a3b8; font-size: 15px; line-height: 1.6;">
              Hello <strong style="color: #f9fafb;">${name}</strong>, thank you for enrolling in <strong style="color: #1e6fff;">${courseTitle}</strong>.
            </p>
            
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; margin: 24px 0;">
              <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b;">Student ID:</td>
                  <td style="padding: 8px 0; color: #f5a623; font-weight: 700; text-align: right;">${studentId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b;">Amount Paid:</td>
                  <td style="padding: 8px 0; color: #10b981; font-weight: 700; text-align: right;">₹${amount}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b;">Bank UTR / Ref ID:</td>
                  <td style="padding: 8px 0; color: #f9fafb; font-family: monospace; font-size: 13px; text-align: right;">${utrId}</td>
                </tr>
              </table>
            </div>

            ${
              zoomLink
                ? `
            <div style="background: rgba(245,166,35,0.1); border: 1px solid rgba(245,166,35,0.3); border-radius: 12px; padding: 18px; margin-bottom: 24px;">
              <strong style="color: #f5a623; display: block; margin-bottom: 6px;">📹 Live Session Zoom Link:</strong>
              <a href="${zoomLink}" style="color: #1e6fff; word-break: break-all;">${zoomLink}</a>
            </div>
            `
                : ""
            }

            <div style="text-align: center; margin-top: 24px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/my-courses" style="background: #1e6fff; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 700; display: inline-block;">Access Your Course Portal →</a>
            </div>
          </div>
          <div style="border-top: 1px solid rgba(255,255,255,0.08); padding: 20px; text-align: center; color: #64748b; font-size: 12px;">
            Need help? Contact support@procareerlabs.com
          </div>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Error sending enrollment confirmation email:", error);
    return { success: false, error };
  }
}
