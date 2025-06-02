import bcrypt from 'bcryptjs';
import { apiGet, apiPost, apiPut } from '@/utils/api';
import { AUTH_ENDPOINTS, USER_ENDPOINTS } from '@/config/api';

// Interface for User data
export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin' | 'superadmin';
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

// Helper function to compare passwords (client-side only for verification)
export async function comparePassword(candidatePassword: string, hashedPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  } catch (error) {
    return false;
  }
}

// Helper functions that use the backend API

// Create a new user
export async function createUser(userData: {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
}): Promise<IUser> {
  const response = await apiPost<{user: IUser}>(AUTH_ENDPOINTS.REGISTER, userData);
  return response.user;
}

// Find user by email - this would typically be done server-side
// Frontend should use authentication endpoints instead
export async function findUserByEmail(email: string): Promise<IUser | null> {
  try {
    // This is just a placeholder - in reality, you'd use authentication endpoints
    // This endpoint likely doesn't exist in your backend and would be a security risk
    const response = await apiPost<{user: IUser | null}>('/users/find-by-email', { email });
    return response.user;
  } catch (error) {
    console.error('Error finding user by email:', error);
    return null;
  }
}

// Get current user profile
export async function getCurrentUser(): Promise<IUser | null> {
  try {
    const response = await apiGet<{user: IUser}>(USER_ENDPOINTS.PROFILE);
    return response.user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Update user profile
export async function updateUser(updateData: Partial<IUser>): Promise<IUser | null> {
  try {
    const response = await apiPut<{user: IUser}>(USER_ENDPOINTS.UPDATE_PROFILE, updateData);
    return response.user;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
}

// Change user password
export async function updateUserPassword(currentPassword: string, newPassword: string): Promise<boolean> {
  try {
    await apiPost(USER_ENDPOINTS.CHANGE_PASSWORD, { currentPassword, newPassword });
    return true;
  } catch (error) {
    console.error('Error updating password:', error);
    return false;
  }
}
