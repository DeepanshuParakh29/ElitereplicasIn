import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

// Import admin models and services
import { AdminUser } from '@/lib/models/adminUser';
import * as adminUserService from '@/lib/services/adminUserService';
import { verifyToken, generateToken, JwtPayload, ADMIN_TOKEN_COOKIE } from '@/lib/auth/jwt';
import { rateLimit, authLimiter } from '@/lib/rate-limit';

// Validation schema for admin user creation/update
const adminUserSchema = z.object({
  username: z.string().min(3).max(50),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).optional(),
  role: z.enum(['admin', 'superadmin']),
  status: z.enum(['active', 'inactive'])
});

// GET - Get all admin users (protected, requires admin role)
export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = await rateLimit(ip, authLimiter);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, message: 'Too many requests' },
        { status: 429, headers: rateLimitResult.headers }
      );
    }
    
    // Verify authentication
    const token = request.cookies.get(ADMIN_TOKEN_COOKIE)?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const payload = verifyToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Check if user has admin privileges
    if (payload.role !== 'admin' && payload.role !== 'superadmin') {
      return NextResponse.json(
        { success: false, message: 'Admin privileges required' },
        { status: 403 }
      );
    }
    
    // Get all admin users
    const adminUsers = await adminUserService.getAllAdminUsers();
    
    // Remove password field from response
    const safeAdminUsers = adminUsers.map(user => {
      const { password, ...safeUser } = user;
      return safeUser;
    });
    
    return NextResponse.json({
      success: true,
      adminUsers: safeAdminUsers
    });
    
  } catch (error) {
    console.error('Error getting admin users:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get admin users' },
      { status: 500 }
    );
  }
}

// POST - Create a new admin user (protected, requires superadmin role)
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = await rateLimit(ip, authLimiter);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, message: 'Too many requests' },
        { status: 429, headers: rateLimitResult.headers }
      );
    }
    
    // Verify authentication
    const token = request.cookies.get(ADMIN_TOKEN_COOKIE)?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const payload = verifyToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Check if user has superadmin privileges
    if (payload.role !== 'superadmin') {
      return NextResponse.json(
        { success: false, message: 'Superadmin privileges required' },
        { status: 403 }
      );
    }
    
    // Parse and validate request body
    const body = await request.json();
    
    try {
      adminUserSchema.parse(body);
    } catch (validationError) {
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: (validationError as z.ZodError).errors },
        { status: 400 }
      );
    }
    
    // Create new admin user
    const newAdminUser = await adminUserService.createAdminUser(body);
    
    // Remove password from response
    const { password, ...safeUser } = newAdminUser;
    
    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      adminUser: safeUser
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating admin user:', error);
    
    // Handle duplicate username
    if ((error as Error).message === 'Username already exists') {
      return NextResponse.json(
        { success: false, message: 'Username already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to create admin user' },
      { status: 500 }
    );
  }
}

// PUT - Update an admin user (protected, requires admin/superadmin role)
export async function PUT(request: NextRequest) {
  try {
    // Apply rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = await rateLimit(ip, authLimiter);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, message: 'Too many requests' },
        { status: 429, headers: rateLimitResult.headers }
      );
    }
    
    // Verify authentication
    const token = request.cookies.get(ADMIN_TOKEN_COOKIE)?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const payload = verifyToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Check if user has admin privileges
    if (payload.role !== 'admin' && payload.role !== 'superadmin') {
      return NextResponse.json(
        { success: false, message: 'Admin privileges required' },
        { status: 403 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Validate update data
    try {
      z.object({
        username: z.string().min(3).max(50).optional(),
        name: z.string().min(2).max(100).optional(),
        email: z.string().email().optional(),
        password: z.string().min(8).optional(),
        role: z.enum(['admin', 'superadmin']).optional(),
        status: z.enum(['active', 'inactive']).optional()
      }).parse(updateData);
    } catch (validationError) {
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: (validationError as z.ZodError).errors },
        { status: 400 }
      );
    }
    
    // Check if user is trying to update a superadmin
    const userToUpdate = await adminUserService.getAdminUserById(id);
    
    if (!userToUpdate) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Only superadmins can update other superadmins
    if (userToUpdate.role === 'superadmin' && payload.role !== 'superadmin') {
      return NextResponse.json(
        { success: false, message: 'You do not have permission to update a superadmin' },
        { status: 403 }
      );
    }
    
    // Regular admins can't change roles to superadmin
    if (payload.role === 'admin' && updateData.role === 'superadmin') {
      return NextResponse.json(
        { success: false, message: 'You do not have permission to assign superadmin role' },
        { status: 403 }
      );
    }
    
    // Update admin user
    const updatedUser = await adminUserService.updateAdminUser(id, updateData);
    
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: 'Failed to update user' },
        { status: 500 }
      );
    }
    
    // Remove password from response
    const { password, ...safeUser } = updatedUser;
    
    return NextResponse.json({
      success: true,
      message: 'Admin user updated successfully',
      adminUser: safeUser
    });
    
  } catch (error) {
    console.error('Error updating admin user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update admin user' },
      { status: 500 }
    );
  }
}

// DELETE - Delete an admin user (protected, requires superadmin role)
export async function DELETE(request: NextRequest) {
  try {
    // Apply rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = await rateLimit(ip, authLimiter);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, message: 'Too many requests' },
        { status: 429, headers: rateLimitResult.headers }
      );
    }
    
    // Verify authentication
    const token = request.cookies.get(ADMIN_TOKEN_COOKIE)?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const payload = verifyToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Check if user has superadmin privileges
    if (payload.role !== 'superadmin') {
      return NextResponse.json(
        { success: false, message: 'Superadmin privileges required' },
        { status: 403 }
      );
    }
    
    // Parse URL to get the ID
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Check if user exists and is not the current user
    const userToDelete = await adminUserService.getAdminUserById(id);
    
    if (!userToDelete) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Prevent deleting yourself
    if (userToDelete._id && userToDelete._id.toString() === payload.id) {
      return NextResponse.json(
        { success: false, message: 'You cannot delete your own account' },
        { status: 403 }
      );
    }
    
    // Delete admin user
    const deleted = await adminUserService.deleteAdminUser(id);
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Failed to delete user' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Admin user deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting admin user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete admin user' },
      { status: 500 }
    );
  }
}
