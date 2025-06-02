import { apiGet, apiPost } from '@/utils/api';
import { AUTH_ENDPOINTS } from '@/config/api';

// Interface for Verification Token data
export interface IVerificationToken {
  _id: string;
  userId: string;
  token: string;
  type: 'email' | 'password';
  createdAt: Date;
  expiresAt: Date;
}

// API response interfaces
interface VerificationResponse {
  success: boolean;
  message: string;
  token?: IVerificationToken;
  userId?: string;
}

// Helper functions

// Request a new verification token (email verification or password reset)
export async function requestVerificationToken(
  email: string,
  type: 'email' | 'password'
): Promise<boolean> {
  try {
    const endpoint = type === 'email' 
      ? AUTH_ENDPOINTS.RESEND_VERIFICATION
      : AUTH_ENDPOINTS.REQUEST_PASSWORD_RESET;
    
    const response = await apiPost<VerificationResponse>(endpoint, { email });
    return response.success;
  } catch (error) {
    console.error(`Error requesting ${type} verification token:`, error);
    return false;
  }
}

// Verify an email with a token
export async function verifyEmailToken(token: string): Promise<boolean> {
  try {
    const response = await apiGet<VerificationResponse>(`${AUTH_ENDPOINTS.VERIFY_EMAIL}?token=${token}`);
    return response.success;
  } catch (error) {
    console.error('Error verifying email token:', error);
    return false;
  }
}

// Reset password with a token
export async function resetPasswordWithToken(
  token: string,
  newPassword: string
): Promise<boolean> {
  try {
    const response = await apiPost<VerificationResponse>(AUTH_ENDPOINTS.RESET_PASSWORD, {
      token,
      newPassword
    });
    return response.success;
  } catch (error) {
    console.error('Error resetting password with token:', error);
    return false;
  }
}
