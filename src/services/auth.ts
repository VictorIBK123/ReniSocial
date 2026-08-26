import axios from 'axios';

const API_BASE_URL = 'http://51.75.208.211:1045';

/**
 * Register a new user email
 * @param email User's email address
 * @param password User's chosen password
 */
export const registerEmail = async (email: string, password?: string) => {
  try {
    console.log('[AuthService] registerEmail called for:', email);
    const response = await axios.request({
      method: 'POST',
      url: `${API_BASE_URL}/api/auth/register/email`,
      data: {
        mail: email,
      },
    });
    console.log('[AuthService] registerEmail response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[AuthService] registerEmail error:', error?.response?.data || error.message);
    throw error;
  }
};

/**
 * Activate email via OTP or token
 * @param email User's email address
 * @param code OTP code sent to email
 */
export const activateEmail = async (email: string, code: string) => {
  try {
    console.log(`[AuthService] activateEmail called for: ${email} with code: ${code}`);
    const response = await axios.request({
      method: 'POST',
      url: `${API_BASE_URL}/api/auth/register/email/activate`,
      data: {
        mail: email,
        authCode: code,
      },
    });
    console.log('[AuthService] activateEmail response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[AuthService] activateEmail error:', error?.response?.data || error.message);
    throw error;
  }
};

/**
 * Complete the registration process (profile details)
 * @param profileData Object containing first name, last name, username, etc.
 */
export const completeRegistration = async (profileData: Record<string, any>) => {
  try {
    console.log('[AuthService] completeRegistration called for:', profileData.mail);
    const response = await axios.request({
      method: 'POST',
      url: `${API_BASE_URL}/api/auth/register/complete`,
      data: profileData,
    });
    console.log('[AuthService] completeRegistration response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[AuthService] completeRegistration error:', error?.response?.data || error.message);
    throw error;
  }
};

/**
 * Login existing user
 * @param email User's email address
 * @param password User's password
 */
export const login = async (email: string, password?: string) => {
  try {
    console.log('[AuthService] login called for:', email);
    const response = await axios.request({
      method: 'POST',
      url: `${API_BASE_URL}/api/auth/signin`,
      data: {
        mail: email,
        pword: password,
      },
    });
    console.log('[AuthService] login response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[AuthService] login error:', error?.response?.data || error.message);
    throw error;
  }
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
  try {
    console.log('[AuthService] signOut called');
    const response = await axios.request({
      method: 'POST',
      url: `${API_BASE_URL}/in/auth/signout`,
    });
    console.log('[AuthService] signOut response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[AuthService] signOut error:', error?.response?.data || error.message);
    throw error;
  }
};
