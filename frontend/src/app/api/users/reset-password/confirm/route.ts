import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/db';
import { IUser } from '@/lib/models/user';
import { IVerificationToken } from '@/lib/models/verification';
import { rateLimit, authLimiter } from '@/lib/rate-limit';
import bcrypt from 'bcryptjs';

// Password validation schema
const passwordSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(8).max(100),
  confirmPassword: z.string().min(8).max(100)
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// Hash password
async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

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
          message: 'Too many password reset attempts. Please try again later.' 
        },
        { 
          status: 429,
          headers: rateLimitResult.headers
        }
      );
    }
    
    // Connect to the database
    await connectToDatabase();
    
    // Parse and validate the request body
    const body = await request.json();
    
    try {
      passwordSchema.parse(body);
    } catch (validationError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation error', 
          errors: (validationError as z.ZodError).errors 
        },
        { status: 400 }
      );
    }
    
    const { token, password } = body;
    
    // This is a mock implementation since we don't have direct DB access in the frontend
    // In a real backend implementation, you would query the database directly
    
    // Find verification token
    let verification: IVerificationToken | null = null;
    
    try {
      // In a real implementation, this would be a database query
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/verifications/find-by-token?token=${token}&type=password`);
      const data = await response.json();
      verification = data.verification;
    } catch (error) {
      console.error('Error finding verification token:', error);
    }
    
    // Check if token exists
    if (!verification) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired password reset token' },
        { status: 400 }
      );
    }
    
    // Check if token is expired
    const now = new Date();
    if (new Date(verification.expiresAt) < now) {
      return NextResponse.json(
        { success: false, message: 'Password reset token has expired' },
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
    
    // Hash the new password
    const hashedPassword = await hashPassword(password);
    
    // Update user password
    try {
      // In a real implementation, this would update the user in the database
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/update-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          password: hashedPassword,
          updatedAt: new Date()
        })
      });
    } catch (error) {
      console.error('Error updating user password:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to update password' },
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
      message: 'Password has been reset successfully'
    });
    
  } catch (error) {
    console.error('Error in password reset process:', error);
    return NextResponse.json(
      { success: false, message: 'Password reset failed due to server error' },
      { status: 500 }
    );
  }
}
