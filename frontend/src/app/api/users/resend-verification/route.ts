import { NextRequest, NextResponse } from 'next/server';
import { IUser } from '@/lib/models/user';
import { IVerificationToken } from '@/lib/models/verification';
import { connectToDatabase } from '@/lib/db';
import { sendVerificationEmail, generateVerificationToken } from '@/lib/email/mailer';

// Rate limiting configuration
const RATE_LIMIT = 5; // Maximum 5 resend attempts
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour window

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Parse the request body
    const { email } = await request.json();
    
    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }
    
    // This is a mock implementation since we don't have direct DB access in the frontend
    // In a real backend implementation, you would query the database
    // For now, we'll simulate finding a user
    let user: IUser | null = null;
    
    try {
      // In a real implementation, this would be a database query
      // Here we're simulating the API behavior
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/find?email=${encodeURIComponent(email.toLowerCase())}`);
      const data = await response.json();
      user = data.user;
    } catch (error) {
      console.error('Error finding user:', error);
    }
    
    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if user is already verified
    if (user.isVerified) {
      return NextResponse.json(
        { success: false, message: 'User is already verified' },
        { status: 400 }
      );
    }
    
    // Simulate finding an existing verification record
    // In a real backend implementation, you would query the database
    let existingVerification: (IVerificationToken & { resendAttempts?: number; lastResendTime?: number }) | null = null;
    
    try {
      // In a real implementation, this would be a database query
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/verifications/find?userId=${user._id}`);
      const data = await response.json();
      existingVerification = data.verification;
    } catch (error) {
      console.error('Error finding verification:', error);
    }
    
    // Check rate limiting
    if (existingVerification) {
      const resendAttempts = existingVerification.resendAttempts || 0;
      const lastResendTime = existingVerification.lastResendTime || 0;
      const currentTime = Date.now();
      
      // Check if within rate limit window
      if (currentTime - lastResendTime < RATE_LIMIT_WINDOW && resendAttempts >= RATE_LIMIT) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Too many verification email requests. Please try again later.' 
          },
          { status: 429 }
        );
      }
      
      // Update resend attempts
      // In a real implementation, you would update the database record
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/verifications/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            verificationId: existingVerification._id,
            resendAttempts: resendAttempts + 1,
            lastResendTime: currentTime
          })
        });
      } catch (error) {
        console.error('Error updating verification:', error);
      }
      
      // Send verification email
      await sendVerificationEmail(user.email, existingVerification.token);
      
      return NextResponse.json({
        success: true,
        message: 'Verification email has been resent'
      });
    } else {
      // Create new verification token if none exists
      const token = generateVerificationToken();
      
      // Create new verification record
      // In a real implementation, you would create a database record
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/verifications/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user._id,
            token,
            type: 'email',
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours expiry
            resendAttempts: 1,
            lastResendTime: Date.now()
          })
        });
      } catch (error) {
        console.error('Error creating verification:', error);
      }
      
      // Send verification email
      await sendVerificationEmail(user.email, token);
      
      return NextResponse.json({
        success: true,
        message: 'Verification email has been sent'
      });
    }
  } catch (error) {
    console.error('Error resending verification email:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to resend verification email' },
      { status: 500 }
    );
  }
}
