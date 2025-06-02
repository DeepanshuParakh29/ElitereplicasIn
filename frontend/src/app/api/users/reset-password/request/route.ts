import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { IUser } from '@/lib/models/user';
import { IVerificationToken } from '@/lib/models/verification';
import { sendPasswordResetEmail, generateVerificationToken } from '@/lib/email/mailer';
import { rateLimit, authLimiter } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting based on IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = await rateLimit(ip, authLimiter);
    
    // Check if rate limited
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Too many password reset requests. Please try again later.' 
        },
        { 
          status: 429,
          headers: rateLimitResult.headers
        }
      );
    }
    
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
    
    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // This is a mock implementation since we don't have direct DB access in the frontend
    // In a real backend implementation, you would query the database
    // Find the user by email
    let user: IUser | null = null;
    
    try {
      // In a real implementation, this would be a database query
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/find?email=${encodeURIComponent(email.toLowerCase())}`);
      const data = await response.json();
      user = data.user;
    } catch (error) {
      console.error('Error finding user:', error);
    }
    
    // For security reasons, always return success even if user doesn't exist
    // This prevents email enumeration attacks
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If a user with that email exists, a password reset link has been sent.'
      });
    }
    
    // Generate a reset token
    const token = generateVerificationToken();
    
    // Create or update verification record
    try {
      // Check if there's an existing token
      const existingTokenResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/verifications/find?userId=${user._id}&type=password`);
      const existingTokenData = await existingTokenResponse.json();
      
      if (existingTokenData.verification) {
        // Update existing token
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/verifications/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            verificationId: existingTokenData.verification._id,
            token,
            expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour expiry
          })
        });
      } else {
        // Create new token
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/verifications/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user._id,
            token,
            type: 'password',
            expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour expiry
          })
        });
      }
    } catch (error) {
      console.error('Error creating/updating password reset token:', error);
      // Continue even if token creation fails
    }
    
    // Send password reset email
    try {
      await sendPasswordResetEmail(user.email, token);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      // Continue even if email sending fails
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'If a user with that email exists, a password reset link has been sent.'
    });
    
  } catch (error) {
    console.error('Error in password reset request process:', error);
    return NextResponse.json(
      { success: false, message: 'Password reset request failed due to server error' },
      { status: 500 }
    );
  }
}
