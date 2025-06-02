import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Email configuration
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587', 10);
const EMAIL_USER = process.env.EMAIL_USER || 'elitereplicas.in@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || '9179780699@Deep';
const EMAIL_FROM = process.env.EMAIL_FROM || 'EliteReplicas <noreply@elitereplicas.in>';
const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';

// Create a transporter
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_PORT === 465, // true for 465, false for other ports
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Generate a verification token
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Send verification email
export async function sendVerificationEmail(email: string, token: string): Promise<boolean> {
  const verificationLink = `${SITE_URL}/verify-email?token=${token}`;
  
  try {
    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to: email,
      subject: 'Verify your email address - EliteReplicas',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${SITE_URL}/Logo.png" alt="EliteReplicas Logo" style="max-width: 200px;">
          </div>
          <h2 style="color: #6b46c1; text-align: center;">Verify Your Email Address</h2>
          <p style="font-size: 16px; line-height: 1.5; color: #333;">Thank you for creating an account with EliteReplicas. Please click the button below to verify your email address:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" style="background-color: #6b46c1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Verify Email Address</a>
          </div>
          <p style="font-size: 14px; line-height: 1.5; color: #666;">If the button above doesn't work, please copy and paste the following URL into your browser:</p>
          <p style="font-size: 14px; word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 4px;">${verificationLink}</p>
          <p style="font-size: 14px; line-height: 1.5; color: #666; margin-top: 30px;">This link will expire in 24 hours. If you did not create an account, please ignore this email.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #888; font-size: 12px;">
            <p>&copy; ${new Date().getFullYear()} EliteReplicas. All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </div>
      `,
    });
    
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// Send password reset email
export async function sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
  const resetLink = `${SITE_URL}/reset-password?token=${token}`;
  
  try {
    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to: email,
      subject: 'Reset Your Password - EliteReplicas',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${SITE_URL}/Logo.png" alt="EliteReplicas Logo" style="max-width: 200px;">
          </div>
          <h2 style="color: #6b46c1; text-align: center;">Reset Your Password</h2>
          <p style="font-size: 16px; line-height: 1.5; color: #333;">We received a request to reset your password. Please click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #6b46c1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p style="font-size: 14px; line-height: 1.5; color: #666;">If the button above doesn't work, please copy and paste the following URL into your browser:</p>
          <p style="font-size: 14px; word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 4px;">${resetLink}</p>
          <p style="font-size: 14px; line-height: 1.5; color: #666; margin-top: 30px;">This link will expire in 1 hour. If you did not request a password reset, please ignore this email.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #888; font-size: 12px;">
            <p>&copy; ${new Date().getFullYear()} EliteReplicas. All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </div>
      `,
    });
    
    console.log('Password reset email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
}

// Send order confirmation email
export async function sendOrderConfirmationEmail(
  email: string, 
  orderNumber: string, 
  orderDetails: { 
    items: Array<{ name: string; quantity: number; price: number }>;
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  }
): Promise<boolean> {
  try {
    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to: email,
      subject: `Order Confirmation #${orderNumber} - EliteReplicas`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${SITE_URL}/Logo.png" alt="EliteReplicas Logo" style="max-width: 200px;">
          </div>
          <h2 style="color: #6b46c1; text-align: center;">Order Confirmation</h2>
          <p style="font-size: 16px; line-height: 1.5; color: #333;">Thank you for your order! We've received your order and are working on it.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="font-size: 16px; margin: 0; color: #333;"><strong>Order Number:</strong> ${orderNumber}</p>
          </div>
          <h3 style="color: #333; margin-top: 30px;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="padding: 10px; text-align: left; border-bottom: 1px solid #e0e0e0;">Item</th>
                <th style="padding: 10px; text-align: center; border-bottom: 1px solid #e0e0e0;">Qty</th>
                <th style="padding: 10px; text-align: right; border-bottom: 1px solid #e0e0e0;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${orderDetails.items.map(item => `
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">${item.name}</td>
                  <td style="padding: 10px; text-align: center; border-bottom: 1px solid #e0e0e0;">${item.quantity}</td>
                  <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e0e0e0;">₹${item.price.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 10px; text-align: right;"><strong>Subtotal:</strong></td>
                <td style="padding: 10px; text-align: right;">₹${orderDetails.subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 10px; text-align: right;"><strong>Shipping:</strong></td>
                <td style="padding: 10px; text-align: right;">₹${orderDetails.shipping.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 10px; text-align: right;"><strong>Tax:</strong></td>
                <td style="padding: 10px; text-align: right;">₹${orderDetails.tax.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 10px; text-align: right; border-top: 2px solid #e0e0e0;"><strong>Total:</strong></td>
                <td style="padding: 10px; text-align: right; border-top: 2px solid #e0e0e0;"><strong>₹${orderDetails.total.toFixed(2)}</strong></td>
              </tr>
            </tfoot>
          </table>
          <p style="font-size: 16px; line-height: 1.5; color: #333; margin-top: 30px;">You can view your order status by visiting your <a href="${SITE_URL}/user/orders" style="color: #6b46c1; text-decoration: none;">account page</a>.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #888; font-size: 12px;">
            <p>&copy; ${new Date().getFullYear()} EliteReplicas. All rights reserved.</p>
            <p>If you have any questions, please contact our customer service at support@elitereplicas.in</p>
          </div>
        </div>
      `,
    });
    
    console.log('Order confirmation email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return false;
  }
}
