/**
 * OTP API Service
 * Communicates with the backend OTP endpoints
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const OTP_API_URL = `${API_URL}/api/otp`;

export interface SendOTPResponse {
  success: boolean;
  message: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
}

/**
 * Send OTP to email address
 * @param email - User's email address
 * @param name - Optional user's name for email personalization
 * @returns Promise with success status and message
 */
export async function sendOTP(email: string, name?: string): Promise<SendOTPResponse> {
  try {
    const response = await fetch(`${OTP_API_URL}/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, ...(name && { name }) }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send OTP');
    }

    return data;
  } catch (error: any) {
    console.error('[OTPApiService] Error sending OTP:', error);
    throw new Error(error.message || 'Failed to send OTP. Please try again.');
  }
}

/**
 * Verify OTP code
 * @param email - User's email address
 * @param otp - OTP code to verify
 * @returns Promise with success status and message
 */
export async function verifyOTP(email: string, otp: string): Promise<VerifyOTPResponse> {
  try {
    const response = await fetch(`${OTP_API_URL}/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to verify OTP');
    }

    return data;
  } catch (error: any) {
    console.error('[OTPApiService] Error verifying OTP:', error);
    throw new Error(error.message || 'Failed to verify OTP. Please try again.');
  }
}

export default {
  sendOTP,
  verifyOTP,
};

