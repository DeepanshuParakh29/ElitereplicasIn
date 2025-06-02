import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/db';
import { IUser } from '@/lib/models/user';
import { IVerificationToken } from '@/lib/models/verification';
import { rateLimit } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  try {
    // Get token from query parameters
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    
    // Validate token
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Verification token is required' },
        { status: 400 }
      );
    }
    
    // Apply rate limiting based on IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = await rateLimit(ip);
    
    // Check if rate limited
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Too many verification attempts. Please try again later.' 
        },
        { 
          status: 429,
          headers: rateLimitResult.headers
        }
      );
    }
    
    // Connect to the database
    await connectToDatabase();
    
    // This is a mock implementation since we don't have direct DB access in the frontend
    // In a real backend implementation, you would query the database
    // Find verification token
    let verification: IVerificationToken | null = null;
    
    try {
      // In a real implementation, this would be a database query
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/verifications/find-by-token?token=${token}`);
      const data = await response.json();
      verification = data.verification;
    } catch (error) {
      console.error('Error finding verification token:', error);
    }
    
    // Check if token exists
    if (!verification) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }
    
    // Check if token is expired
    const now = new Date();
    if (new Date(verification.expiresAt) < now) {
      return NextResponse.json(
        { success: false, message: 'Verification token has expired' },
        { status: 400 }
      );
    }
    
    // Find user
    let user: IUser | null = null;
    
    try {
      // In a real implementation, this would be a database query
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/find-by-id?userId=${verification.userId}`);
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
    if (user.isEmailVerified) {
      return NextResponse.json(
        { success: false, message: 'Email is already verified' },
        { status: 400 }
      );
    }
    
    // Update user verification status
    try {
      // In a real implementation, this would update the user in the database
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          isEmailVerified: true,
          updatedAt: new Date()
        })
      });
    } catch (error) {
      console.error('Error updating user verification status:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to verify email' },
        { status: 500 }
      );
    }
    
    // Delete verification token
    try {
      // In a real implementation, this would delete the token from the database
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/verifications/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          verificationId: verification._id
        })
      });
    } catch (error) {
      console.error('Error deleting verification token:', error);
      // Continue even if token deletion fails
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Email verified successfully'
    });
    
  } catch (error) {
    console.error('Error in email verification process:', error);
    return NextResponse.json(
      { success: false, message: 'Email verification failed due to server error' },
      { status: 500 }
    );
  }
}
