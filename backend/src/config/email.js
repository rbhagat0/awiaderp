import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendResetEmail = async ({ to, resetUrl, userName }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'AWIAD ERP - Password Reset Request',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">AWIAD ERP</h1>
        </div>
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e9ecef;">
          <h2 style="color: #333; margin-top: 0;">Password Reset</h2>
          <p>Hello ${userName || 'User'},</p>
          <p>You requested a password reset for your AWIAD ERP account. Click the button below to set a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #3B82F6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p style="color: #666; font-size: 14px;">This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
          <p style="color: #666; font-size: 14px;">Or copy and paste this link: ${resetUrl}</p>
        </div>
      </body>
      </html>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendApprovalEmail = async ({ to, userName, companyName, adminName }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'AWIAD ERP - Password Reset Approved',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">AWIAD ERP</h1>
        </div>
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e9ecef;">
          <h2 style="color: #333; margin-top: 0;">Password Reset Approved</h2>
          <p>Hello ${userName || 'User'},</p>
          <p>Your password reset request has been approved by ${adminName} from ${companyName}.</p>
          <p>You can now reset your password using the link sent to your email.</p>
        </div>
      </body>
      </html>
    `,
  };

  return transporter.sendMail(mailOptions);
};
