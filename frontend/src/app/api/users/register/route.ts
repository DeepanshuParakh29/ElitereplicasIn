import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { IUser } from '@/lib/models/user';
import { IVerificationToken } from '@/lib/models/verification';
import { sendVerificationEmail, generateVerificationToken } from '@/lib/email/mailer';
import { rateLimit } from '@/lib/rate-limit';

// Rate limiting configuration
const RATE_LIMIT = 5; // Maximum 5 registration attempts
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour window

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting based on IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = await rateLimit(ip);
    
    // Check if rate limited
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Too many registration attempts. Please try again later.' 
        },
        { status: 429 }
      );
    }
    
    // Connect to the database
    await connectToDatabase();
    
    // Parse the request body
    const { name, email, password } = await request.json();
    
    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }
    
    if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Invalid input types' },
        { status: 400 }
      );
    }
    
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters long' },
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
    // Check if user already exists
    let existingUser: IUser | null = null;
    
    try {
      // In a real implementation, this would be a database query
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/find?email=${encodeURIComponent(email.toLowerCase())}`);
      const data = await response.json();
      existingUser = data.user;
    } catch (error) {
      console.error('Error checking existing user:', error);
    }
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Create user
    let newUser: IUser | null = null;
    
    try {
      // In a real implementation, this would create a user in the database
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email: email.toLowerCase(),
          password,
          role: 'user',
          isEmailVerified: false,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      });
      
      const data = await response.json();
      newUser = data.user;
    } catch (error) {
      console.error('Error creating user:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to create user account' },
        { status: 500 }
      );
    }
    
    // Generate verification token
    const token = generateVerificationToken();
    
    // Ensure newUser exists before proceeding
    if (!newUser || !newUser._id) {
      return NextResponse.json(
        { success: false, message: 'Failed to create user account properly' },
        { status: 500 }
      );
    }
    
    // Create verification record
    try {
      // In a real implementation, this would create a verification record in the database
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/verifications/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: newUser._id,
          token,
          type: 'email',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours expiry
        })
      });
    } catch (error) {
      console.error('Error creating verification record:', error);
      // Continue even if verification record creation fails
    }
    
    // Send verification email
    try {
      await sendVerificationEmail(email, token);
    } catch (error) {
      console.error('Error sending verification email:', error);
      // Continue even if email sending fails
    }
    
    // Return success response without sensitive data
    // Use type assertion to tell TypeScript that newUser is not null at this point
    const userWithoutPassword = newUser ? { ...newUser } : {};
    
    // Remove password if it exists
    if ('password' in userWithoutPassword) {
      delete userWithoutPassword.password;
    }
    
    return NextResponse.json({
      success: true,
      message: 'User registered successfully. Please check your email to verify your account.',
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.error('Error in registration process:', error);
    return NextResponse.json(
      { success: false, message: 'Registration failed due to server error' },
      { status: 500 }
    );
  }
}
